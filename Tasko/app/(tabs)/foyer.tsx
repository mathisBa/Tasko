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
  const [showJoinCode, setShowJoinCode] = useState(false);

  const copyFoyerId = async () => {
    if (foyerId) {
      await Clipboard.setStringAsync(foyerId);
      setShowJoinCode(true);
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

  useEffect(() => {
    const fetchFoyer = async () => {
      if (userId) {
        try {
          const response = await fetch(
            `${apiUrl}/api/members?filters[userId][$eq]=` +
              userId +
              "&populate[memberFoyer][populate]=foyerOwner"
          );
          const responseData = await response.json();
          if (responseData.data.length > 0) {
            const fetchedFoyer = responseData.data[0];
            if (fetchedFoyer.memberFoyer) {
              setFoyerId(fetchedFoyer.memberFoyer.documentId);
              setFoyer({
                id: fetchedFoyer.memberFoyer.documentId,
                owner: fetchedFoyer.memberFoyer.foyerOwner.userId,
                members: [],
              });
            } else {
              setFoyerId(null);
              setFoyer(null);
            }
          }
        } catch (error) {
          console.error("Failed to fetch or create foyer:", error);
        }
      }
    };

    fetchFoyer();
  }, [userId]);

  useEffect(() => {
    const fetchFoyerMembers = async () => {
      if (foyerId) {
        try {
          const response = await fetch(
            `${apiUrl}/api/foyers/${foyerId}?populate=members`
          );
          const responseData = await response.json();

          if (responseData.data) {
            const fetchedFoyer = responseData.data;
            if (fetchedFoyer.members) {
              const members: Member[] = fetchedFoyer.members.map(
                (item: any) => ({
                  id: item.userId,
                  docId: item.documentId,
                  username: item.memberUsername,
                  xp: item.memberXP,
                  points: item.memberPoints,
                })
              );
              setMembers(members);
            } else {
              setMembers([]);
            }
          }
        } catch (error) {
          console.error("Failed to fetch or create foyer:", error);
        }
      }
    };
    fetchFoyerMembers();
  }, [foyerId]);

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
            {
              color: theme.colors.onSurface,
              fontFamily: fontBody,
            },
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
          <Text
            style={{
              color: theme.colors.onSurface,
              fontFamily: fontBody,
            }}
          >
            {foyer && item.id === foyer.owner ? "Propriétaire" : "Membre"}
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
    <View style={styles.container}>
      {foyerId ? (
        <>
          <View style={styles.headerList}>
            <Text
              style={{
                color: theme.colors.onBackground,
                fontFamily: fontTitle,
                fontSize: 16,
              }}
            >
              Membres
            </Text>
          </View>

          <FlatList
            data={members.sort((a, b) => b.xp - a.xp)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          />

          <TouchableOpacity
            style={[
              styles.bottomButton,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            <Text
              style={{
                color: theme.colors.onBackground,
                fontFamily: fontButton,
                fontSize: 14,
              }}
              onPress={() => copyFoyerId()}
            >
              Add
            </Text>
            <Ionicons
              size={22}
              name="add-circle-outline"
              color={theme.colors.onBackground}
            />
          </TouchableOpacity>

          {showJoinCode && foyerId && (
            <View style={{ marginTop: 20 }}>
              <Text
                style={{
                  color: "red",
                  fontFamily: fontBody,
                  fontSize: 16,
                  textAlign: "center",
                  marginBottom: 200,
                }}
              >
                Donnez ce code pour rejoindre le foyer : {foyerId}
              </Text>
            </View>
          )}
        </>
      ) : (
        <>
          <Text
            style={{
              color: theme.colors.onBackground,
              fontFamily: fontTitle,
              fontSize: 16,
              marginBottom: 10,
            }}
          >
            Créer un foyer
          </Text>

          <TextInput
            placeholder="Nom du foyer"
            placeholderTextColor="#888"
            value={foyerName}
            onChangeText={setFoyerName}
            style={[
              {
                backgroundColor: theme.colors.surface,
                color: theme.colors.onSurface,
                fontFamily: fontBody,
              },
            ]}
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
                fontSize: 14,
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
              marginBottom: 10,
            }}
          >
            Rejoindre un foyer
          </Text>

          <TextInput
            placeholder="Code unique du foyer"
            placeholderTextColor="#888"
            value={foyerUID}
            onChangeText={setFoyerUID}
            style={[
              {
                backgroundColor: theme.colors.surface,
                color: theme.colors.onSurface,
                fontFamily: fontBody,
              },
            ]}
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
                fontSize: 14,
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    flex: 1,
    padding: 10,
  },
  header: {
    display: "flex",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerList: {
    display: "flex",
    justifyContent: "flex-start",
    textAlign: "left",
    width: "100%",
    paddingTop: 10,
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
  },
  avatar: {
    width: 36,
    aspectRatio: 1 / 1,
    borderRadius: 5,
  },
  rowMember: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  rowProfile: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  number: {
    fontSize: 16,
    marginRight: 12,
  },
  bottomButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    width: "100%",
    padding: 10,
    borderRadius: 5,
  },
});
