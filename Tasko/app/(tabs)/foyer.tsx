import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
  StyleSheet,
  TextInput,
  Modal,
} from "react-native";
import { useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { StateContext } from "@/app/StateContext";
import * as Clipboard from "expo-clipboard";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

type Member = {
  id: string;
  docId: string;
  username: string;
  xp: number;
  points: number;
};

type Foyer = {
  id: string;
  owner: string;
  members: Member[];
};

export default function Foyer() {
  const router = useRouter();
  const { userId, setUserId } = useContext(StateContext);
  const { userDocId, setUserDocId } = useContext(StateContext);
  const { foyerId, setFoyerId } = useContext(StateContext);
  const [foyer, setFoyer] = useState<Foyer | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [foyerName, setFoyerName] = useState("");
  const [foyerUID, setFoyerUID] = useState("");

  const [showJoinCodeModal, setShowJoinCodeModal] = useState(false);

  const copyFoyerId = async () => {
    if (foyerId) {
      await Clipboard.setStringAsync(foyerId);
      setShowJoinCodeModal(true);
    }
  };

  const removeMemberFromFoyer = async (memberDocId: string) => {
    try {
      const res = await fetch(`${apiUrl}/api/members/${memberDocId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            memberFoyer: null,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Erreur suppression du foyer :", data);
        alert("Échec de la suppression du foyer pour ce membre.");
        return;
      }

      console.log("Membre détaché du foyer :", data);
      alert("Membre retiré du foyer avec succès.");

      router.replace("/foyer");
    } catch (error) {
      console.error("Erreur réseau ou inattendue :", error);
      alert("Une erreur est survenue lors du retrait du membre.");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (!userId) {
        router.replace("/auth");
      }
    }, [userId])
  );

  useFocusEffect(
    React.useCallback(() => {
      const fetchAll = async () => {
        try {
          const res = await fetch(
            `${apiUrl}/api/members?filters[userId][$eq]=${userId}&populate[memberFoyer][populate]=foyerOwner`
          );
          const data = await res.json();

          if (data.data.length > 0) {
            const member = data.data[0];
            if (member.memberFoyer) {
              const currentFoyerId = member.memberFoyer.documentId;
              setFoyerId(currentFoyerId);
              setFoyer({
                id: currentFoyerId,
                owner: member.memberFoyer.foyerOwner.userId,
                members: [],
              });

              const membersRes = await fetch(
                `${apiUrl}/api/foyers/${currentFoyerId}?populate=members`
              );
              const membersData = await membersRes.json();

              if (membersData.data?.members) {
                const fetchedMembers: Member[] = membersData.data.members.map(
                  (item: any) => ({
                    id: item.userId,
                    docId: item.documentId,
                    username: item.memberUsername,
                    xp: item.memberXP,
                    points: item.memberPoints,
                  })
                );
                setMembers(fetchedMembers);
              } else {
                setMembers([]);
              }
            } else {
              setFoyer(null);
              setFoyerId(null);
              setMembers([]);
            }
          }
        } catch (error) {
          console.error("Erreur lors du refresh foyer :", error);
        }
      };

      fetchAll();
    }, [userId])
  );

  const theme = useTheme();
  const fontBody = theme.fonts.bodyMedium.fontFamily;
  const fontButton = theme.fonts.labelMedium.fontFamily;
  const fontTitle = theme.fonts.titleMedium.fontFamily;

  const cleanHex = (color: string) => color.replace("#", "").substring(0, 6);

  const joinFoyer = async (foyerUID: string) => {
    if (!foyerUID.trim()) {
      alert("Le nom du foyer est obligatoire.");
      return;
    }
    try {
      const addFoyerUser = await fetch(`${apiUrl}/api/members/${userDocId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            memberFoyer: foyerUID,
          },
        }),
      });
      setFoyerId(foyerUID);
    } catch (error) {
      console.error("Erreur createFoyer :", error);
      alert("Une erreur est survenue.");
    }
  };

  const createFoyer = async (foyerName: string) => {
    if (!foyerName.trim()) {
      alert("Le nom du foyer est obligatoire.");
      return;
    }

    try {
      const foyerRes = await fetch(`${apiUrl}/api/foyers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            foyerName: foyerName.trim(),
            foyerOwner: userDocId,
          },
        }),
      });

      const foyerData = await foyerRes.json();

      if (!foyerRes.ok || !foyerData.data || !foyerData.data.id) {
        console.error("Erreur création foyer :", foyerData);
        alert("Échec de la création du foyer.");
        return;
      }

      const foyerId = foyerData.data.documentId;

      const addFoyerUser = await fetch(`${apiUrl}/api/members/${userDocId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            memberFoyer: foyerId,
          },
        }),
      });
      setFoyerId(foyerId);
    } catch (error) {
      console.error("Erreur createFoyer :", error);
      alert("Une erreur est survenue.");
    }
  };

  const renderItem: ListRenderItem<Member> = ({ item, index }) => (
    <View style={[styles.rowMember, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.rowProfile}>
        <Text
          style={[
            styles.number,
            { color: theme.colors.onSurface, fontFamily: fontBody },
          ]}
        >
          {index + 1}
        </Text>
        <Image
          style={styles.avatar}
          source={{
            uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              item.username || "Membre"
            )}&background=${cleanHex(theme.colors.primary)}&color=ffffff`,
          }}
        />
        <View>
          <Text
            style={{
              color: theme.colors.onSurface,
              fontFamily: fontButton,
              fontSize: 16,
            }}
          >
            {item.username} {item.id === userId ? "(Vous)" : ""}
          </Text>
          <Text style={{ color: theme.colors.onSurface, fontFamily: fontBody }}>
            Membre
          </Text>
        </View>
      </View>
      <TouchableOpacity
        disabled={!(foyer && userId === foyer.owner && item.id != foyer.owner)}
        onPress={() => {
          if (foyer && userId === foyer.owner) {
            removeMemberFromFoyer(item.docId);
          }
        }}
      >
        <Ionicons
          size={22}
          name={
            foyer && userId === foyer.owner ? "trash-outline" : "person-outline"
          }
          color={theme.colors.primary}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Modal
        visible={showJoinCodeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowJoinCodeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text
              style={{
                fontFamily: fontTitle,
                fontSize: 18,
                color: theme.colors.onSurface,
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              Code du foyer
            </Text>
            <Text
              style={{
                fontFamily: fontBody,
                fontSize: 16,
                color: theme.colors.onSurface,
                textAlign: "center",
                marginBottom: 6,
              }}
            >
              Partage ce code à tes colocs :
            </Text>
            <Text
              style={{
                fontFamily: fontBody,
                fontSize: 16,
                color: theme.colors.onSurface,
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              {foyerId}
            </Text>

            <TouchableOpacity
              style={[
                styles.modalButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={async () => {
                await Clipboard.setStringAsync(foyerId || "");
                setShowJoinCodeModal(false);
              }}
            >
              <Text
                style={{
                  color: theme.colors.onBackground,
                  fontFamily: fontButton,
                }}
              >
                Copier
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowJoinCodeModal(false)}
              style={styles.closeIcon}
            >
              <Ionicons name="close" size={24} color={theme.colors.onSurface} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {foyerId ? (
        <>
          <View style={styles.header}>
            <View style={{ width: 28 }} />
            <Text
              style={[
                styles.title,
                { color: theme.colors.onBackground, fontFamily: fontTitle },
              ]}
            >
              Membres
            </Text>
            <TouchableOpacity onPress={copyFoyerId}>
              <Ionicons
                name="add"
                size={28}
                color={theme.colors.onBackground}
              />
            </TouchableOpacity>
          </View>

          <FlatList
            data={members.sort((a, b) => b.xp - a.xp)}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          />
        </>
      ) : (
        <>
          <Text
            style={{
              color: theme.colors.onBackground,
              fontFamily: fontTitle,
              fontSize: 16,
              marginTop: 10,
              marginBottom: 16,
            }}
          >
            Créer un foyer
          </Text>
          <TextInput
            placeholder="Nom du foyer"
            placeholderTextColor="#888"
            style={[
              {
                backgroundColor: theme.colors.surface,
                color: theme.colors.onBackground,
                fontFamily: fontButton,
                padding: 10,
                width: "100%",
                borderRadius: 5,
              },
            ]}
            value={foyerName}
            onChangeText={setFoyerName}
          />
          <TouchableOpacity
            style={[
              styles.bottomButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => createFoyer(foyerName)}
          >
            <Text
              style={{
                color: theme.colors.onBackground,
                fontFamily: fontButton,
              }}
            >
              Créer
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              color: theme.colors.onBackground,
              fontFamily: fontTitle,
              fontSize: 16,
              marginTop: 30,
              marginBottom: 16,
            }}
          >
            Rejoindre un foyer
          </Text>
          <TextInput
            placeholder="Code du foyer"
            placeholderTextColor="#888"
            style={[
              {
                backgroundColor: theme.colors.surface,
                color: theme.colors.onBackground,
                fontFamily: fontButton,
                padding: 10,
                width: "100%",
                borderRadius: 5,
              },
            ]}
            value={foyerUID}
            onChangeText={setFoyerUID}
          />
          <TouchableOpacity
            style={[
              styles.bottomButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => joinFoyer(foyerUID)}
          >
            <Text
              style={{
                color: theme.colors.onBackground,
                fontFamily: fontButton,
              }}
            >
              Rejoindre
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
  },
  title: {
    fontSize: 20,
  },
  rowMember: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  rowProfile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 36,
    aspectRatio: 1,
    borderRadius: 5,
  },
  number: {
    fontSize: 16,
    marginRight: 12,
  },
  bottomButton: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalButton: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
});
