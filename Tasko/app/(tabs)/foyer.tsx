import React, { useContext, useState, useEffect } from "react";
import * as Clipboard from "expo-clipboard";
import { useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { StateContext } from "@/app/StateContext";
import {
  ListRenderItem,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
} from "react-native";

type Member = {
  id: string;
  attributes: {
    user: {
      data: {
        id: string | null;
        attributes: {
          username: string;
        };
      };
    };
    memberXP: number;
    memberPoints: number;
  };
};

export default function Foyer() {
  const router = useRouter();
  const { userId, foyerId, setFoyerId } = useContext(StateContext);
  const [members, setMembers] = useState<Member[]>([]);
  const [foyerOwnerId, setFoyerOwnerId] = useState<string | null>(null);
  const [joinFoyerId, setJoinFoyerId] = useState("");
  const [foyerName, setFoyerName] = useState("");
  const [currentMemberId, setCurrentMemberId] = useState<string | null>(null);
  const [addMemberUsername, setAddMemberUsername] = useState("");

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  useFocusEffect(
    React.useCallback(() => {
      if (!userId) {
        router.replace("/auth");
      } else if (foyerId) {
        fetch(`${apiUrl}/api/foyers/${foyerId}?populate=deep`)
          .then((response) => response.json())
          .then((data) => {
            if (!data.data) {
              setFoyerId(null);
              return;
            }
            setFoyerName(data.data.attributes.foyerName);
            const ownerId = data.data.attributes.foyerOwner.data.id;
            setFoyerOwnerId(ownerId);

            const creator = data.data.attributes.members.data.find(
              (member: any) => member.attributes.user.data.id === userId
            );
            if (creator) {
              setCurrentMemberId(creator.id);
            }

            // Sort members by XP
            const sortedMembers = data.data.attributes.members.data.sort(
              (a: Member, b: Member) =>
                b.attributes.memberXP - a.attributes.memberXP
            );
            setMembers(sortedMembers);
          })
          .catch((error) => console.error(error));
      }
    }, [userId, foyerId])
  );

  const handleJoinFoyer = async () => {
    if (!joinFoyerId.trim()) {
      alert("Veuillez entrer un ID de foyer.");
      return;
    }
    try {
      // Find member id for the current user
      const memberResponse = await fetch(
        `${apiUrl}/api/members?filters[userId][$eq]=${userId}`
      );
      const memberData = await memberResponse.json();
      if (!memberData.data || memberData.data.length === 0) {
        alert("Erreur: Membre non trouvé. III");
        return;
      }
      const memberId = memberData.data[0].id;

      // Update member with the new foyerId
      const updateMemberResponse = await fetch(
        `${apiUrl}/api/members/${memberId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { memberFoyer: joinFoyerId.trim() } }),
        }
      );

      if (updateMemberResponse.ok) {
        setFoyerId(joinFoyerId.trim());
        router.replace("/(tabs)/foyer");
      } else {
        alert("Échec de la mise à jour du membre.");
      }
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue.");
    }
  };

  const handleAddMember = async () => {
    if (!addMemberUsername.trim()) {
      alert("Veuillez entrer un nom d'utilisateur.");
      return;
    }
    try {
      // Find user by username
      const userResponse = await fetch(
        `${apiUrl}/api/users?filters[username][$eq]=${addMemberUsername.trim()}`
      );
      const userData = await userResponse.json();
      if (!userData || userData.length === 0) {
        alert("Erreur: Utilisateur non trouvé.");
        return;
      }
      const newUserId = userData[0].id;

      if (newUserId === userId) {
        alert("Vous ne pouvez pas vous ajouter vous-même.");
        return;
      }

      // Find member by user id
      const memberResponse = await fetch(
        `${apiUrl}/api/members?filters[userId][$eq]=${newUserId}&populate=memberFoyer`
      );
      const memberData = await memberResponse.json();
      if (!memberData.data || memberData.data.length === 0) {
        alert("Erreur: Membre non trouvé.");
        return;
      }
      if (memberData.data[0].attributes.memberFoyer.data) {
        alert("Ce membre est déjà dans un foyer.");
        return;
      }
      const memberId = memberData.data[0].id;

      // Update member with the new foyerId
      const updateMemberResponse = await fetch(
        `${apiUrl}/api/members/${memberId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { memberFoyer: foyerId } }),
        }
      );

      if (updateMemberResponse.ok) {
        setAddMemberUsername("");
        // Refresh the member list
        fetch(`${apiUrl}/api/foyers/${foyerId}?populate=deep`)
          .then((response) => response.json())
          .then((data) => {
            const sortedMembers = data.data.attributes.members.data.sort(
              (a: Member, b: Member) =>
                b.attributes.memberXP - a.attributes.memberXP
            );
            setMembers(sortedMembers);
          });
      } else {
        alert("Échec de l'ajout du membre.");
      }
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue.");
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (memberId === foyerOwnerId) {
      alert("Vous ne pouvez pas vous supprimer vous-même.");
      return;
    }
    try {
      // Update member with the new foyerId
      const updateMemberResponse = await fetch(
        `${apiUrl}/api/members/${memberId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { memberFoyer: null } }),
        }
      );

      if (updateMemberResponse.ok) {
        // Refresh the member list
        fetch(`${apiUrl}/api/foyers/${foyerId}?populate=deep`)
          .then((response) => response.json())
          .then((data) => {
            const sortedMembers = data.data.attributes.members.data.sort(
              (a: Member, b: Member) =>
                b.attributes.memberXP - a.attributes.memberXP
            );
            setMembers(sortedMembers);
          });
      } else {
        alert("Échec de la suppression du membre.");
      }
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue.");
    }
  };

  const theme = useTheme();
  const fontBody = theme.fonts.bodyMedium.fontFamily;
  const fontButton = theme.fonts.labelMedium.fontFamily;
  const fontTitle = theme.fonts.titleMedium.fontFamily;

  const cleanHex = (color: string) => color.replace("#", "").substring(0, 6);

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
              item.attributes.user.data.attributes.username || "Membre"
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
            {item.attributes.user.data.attributes.username}{" "}
            {item.attributes.user.data.id === userId ? "(Vous)" : ""}
          </Text>
          <Text
            style={{
              color: theme.colors.onSurface,
              fontFamily: fontBody,
            }}
          >
            {item.id === foyerOwnerId ? "Propriétaire" : "Membre"}
          </Text>
        </View>
      </View>
      {currentMemberId === foyerOwnerId && item.id !== foyerOwnerId && (
        <TouchableOpacity onPress={() => handleRemoveMember(item.id)}>
          <Ionicons
            size={22}
            name="trash-outline"
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      )}
    </View>
  );

  if (!foyerId) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
            justifyContent: "center",
          },
        ]}
      >
        <View style={styles.noFoyerContainer}>
          <Text
            style={[
              styles.title,
              { color: theme.colors.onBackground, fontFamily: fontTitle },
            ]}
          >
            Rejoindre ou créer un foyer
          </Text>

          <View style={styles.joinFoyerContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.onSurface,
                  fontFamily: fontBody,
                },
              ]}
              placeholder="ID du foyer"
              placeholderTextColor="#888"
              value={joinFoyerId}
              onChangeText={setJoinFoyerId}
            />
            <TouchableOpacity
              style={[
                {
                  backgroundColor: theme.colors.primary,
                  padding: 15,
                  borderRadius: 5,
                },
              ]}
              onPress={handleJoinFoyer}
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
          </View>

          <Text
            style={{ color: theme.colors.onBackground, fontFamily: fontBody }}
          >
            OU
          </Text>

          <TouchableOpacity
            style={[
              styles.bottomButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => router.push("/createFoyer")}
          >
            <Text
              style={{
                color: theme.colors.onBackground,
                fontFamily: fontButton,
                fontSize: 14,
              }}
            >
              Créer un foyer
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            {
              color: theme.colors.onBackground,
              fontFamily: fontTitle,
            },
          ]}
        >
          {foyerName}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginTop: 10,
          }}
        >
          <Text
            style={{ color: theme.colors.onBackground, fontFamily: fontBody }}
          >
            ID du foyer: {foyerId}
          </Text>
          <TouchableOpacity
            onPress={() => Clipboard.setStringAsync(foyerId || "")}
          >
            <Ionicons
              name="copy-outline"
              size={22}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

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

      <FlatList<Member>
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />

      {currentMemberId === foyerOwnerId && (
        <View style={styles.addMemberContainer}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.surface,
                color: theme.colors.onSurface,
                fontFamily: fontBody,
              },
            ]}
            placeholder="Nom d'utilisateur du membre"
            placeholderTextColor="#888"
            value={addMemberUsername}
            onChangeText={setAddMemberUsername}
          />
          <TouchableOpacity
            style={[
              {
                backgroundColor: theme.colors.primary,
                padding: 15,
                borderRadius: 5,
              },
            ]}
            onPress={handleAddMember}
          >
            <Text
              style={{
                color: theme.colors.onBackground,
                fontFamily: fontButton,
              }}
            >
              Ajouter
            </Text>
          </TouchableOpacity>
        </View>
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
  noFoyerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    width: "100%",
    padding: 20,
  },
  joinFoyerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 8,
    borderRadius: 8,
    fontSize: 16,
  },
  addMemberContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
    padding: 10,
  },
});
