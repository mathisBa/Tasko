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

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

type Member = {
  id: string;
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
  const [foyer, setFoyer] = useState<Foyer | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [foyerName, setFoyerName] = useState("");

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
            `${apiUrl}/api/members?filters[userId][$eq]=5`
          );
          const responseData = await response.json();
          if (responseData.data.length > 0) {
            const fetchedFoyer = responseData.data[0];
            if (fetchedFoyer.memberFoyer) {
              setFoyer(fetchedFoyer.attributes);
              setMembers(
                fetchedFoyer.attributes.members.data.map((member: any) => ({
                  id: member.id,
                  ...member.attributes,
                }))
              );
            } else {
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

  const theme = useTheme();
  const fontBody = theme.fonts.bodyMedium.fontFamily;
  const fontButton = theme.fonts.labelMedium.fontFamily;
  const fontTitle = theme.fonts.titleMedium.fontFamily;

  const cleanHex = (color: string) => color.replace("#", "").substring(0, 6);

  const createFoyer = async (foyerName: string) => {
    if (!foyerName.trim()) {
      alert("Le nom du foyer est obligatoire.");
      return;
    }

    try {
      // 1. Création du foyer
      const foyerRes = await fetch(`${apiUrl}/api/foyers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            name: foyerName.trim(),
            owner: userId,
          },
        }),
      });

      const foyerData = await foyerRes.json();

      if (!foyerRes.ok || !foyerData.data) {
        console.error("Erreur création foyer :", foyerData);
        alert("Échec de la création du foyer.");
        return;
      }

      const foyerId = foyerData.data.id;
      console.log("Foyer créé :", foyerData.data);
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
      <TouchableOpacity>
        <Ionicons size={22} name="trash-outline" color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {foyer ? (
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
            >
              Add
            </Text>
            <Ionicons
              size={22}
              name="add-circle-outline"
              color={theme.colors.onBackground}
            />
          </TouchableOpacity>
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
            onPress={() => console.log(foyerName)}
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
