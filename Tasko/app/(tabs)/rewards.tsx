import {
  View,
  Text,
  Image,
  FlatList,
  ListRenderItem,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, {useState, useCallback, useContext, useEffect} from "react";
import { useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import StateContext from "@/app/StateContext";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

type Member = {
  memberId: string;
  memberUsername: string;
  memberXP: number;
  memberPoints: number;
};

type Reward = {
  rewardID: string;
  rewardName: string;
  rewardCost: number;
  rewardDescription: string;
  rewardImage: string;
};

const rewards: Reward[] = [
  {
    rewardID: "1",
    rewardName: "Envoyer une notification",
    rewardCost: 200,
    rewardDescription:
      "Vous avez la possibilité d'envoyer une notification à la personne de votre choix",
    rewardImage:
      "https://www.shutterstock.com/shutterstock/photos/2227267765/display_1500/stock-photo-man-making-fun-of-something-laughing-and-pointing-2227267765.jpg",
  },
  {
    rewardID: "2",
    rewardName: "Envoyer une notification",
    rewardCost: 250,
    rewardDescription:
      "Vous avez la possibilité d'envoyer une notification à la personne de votre choix",
    rewardImage:
      "https://media.istockphoto.com/id/638219322/fr/photo/cest-lui-qui-apporte-de-lhumour-%C3%A0-l%C3%A9quipe.jpg?s=612x612&w=0&k=20&c=cOHtXAlwb40AT_wusJRED1M8k9J3DQbl6WdBLMkO2-w=",
  },
  {
    rewardID: "3",
    rewardName: "Envoyer une notification",
    rewardCost: 300,
    rewardDescription:
      "Vous avez la possibilité d'envoyer une notification à la personne de votre choix",
    rewardImage:
      "https://media.istockphoto.com/id/1496943731/fr/photo/jeune-belle-femme-aux-cheveux-roux-caucasiens-riant-%C3%A0-la-cam%C3%A9ra-portrait-fond-vert.jpg?s=612x612&w=0&k=20&c=9V_v3TLReC_gJ6dNfagaV6NRUPS-6RH9d4zxln2UdTs=",
  },
  {
    rewardID: "4",
    rewardName: "Envoyer une notification",
    rewardCost: 400,
    rewardDescription:
      "Vous avez la possibilité d'envoyer une notification à la personne de votre choix",
    rewardImage:
      "https://img.freepik.com/photos-gratuite/jeune-femme-afro-americaine-portant-salopettes_273609-10360.jpg?semt=ais_hybrid&w=740&q=80",
  },
];

export default function Recompenses() {
  const [members, setMembers] = useState<Member[]>([]);
  const [currentMember, setCurrentMember] = useState<Member>({
    memberId: "NOID",
    memberUsername: "Pas connecté",
    memberXP: 0,
    memberPoints: 0,
  });
  const { foyerId } = useContext(StateContext);
  const { userId, userDocId } = useContext(StateContext);
  const theme = useTheme();
  const fontBody = theme.fonts.bodyMedium.fontFamily;
  const fontButton = theme.fonts.labelMedium.fontFamily;
  const fontTitle = theme.fonts.titleMedium.fontFamily;
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
              const members: Member[] = [];
                fetchedFoyer.members.forEach((memberData: any) => {
                    const member: Member = {
                      memberId: memberData.id,
                      memberUsername: memberData.memberUsername,
                      memberXP: memberData.memberXP,
                      memberPoints: memberData.memberPoints,
                    }
                    if (memberData.documentId === userDocId) {
                        setCurrentMember(member);
                    } else {
                      members.push(member);
                    }
                })
              setMembers(members);
            } else {
              setMembers([]);
            }
          }
        } catch (error) {
          console.error("Failed to fetch foyer:", error);
        }
      }
    };
    fetchFoyerMembers();
  }, [foyerId, userDocId, userId]);


  const cleanHex = (color: string) => color.replace("#", "").substring(0, 6);

  const [targets, setTargets] = useState<Record<string, string>>({});

  const setTarget = useCallback((rewardID: string, memberId: string) => {
    setTargets((p) => ({ ...p, [rewardID]: memberId }));
  }, []);

  const handleClaim = useCallback(
    (reward: Reward) => {
      const targetId = targets[reward.rewardID];
      if (!targetId) return;
      // logique de réclamation avec targetId
    },
    [targets]
  );

  const renderItem: ListRenderItem<Reward> = ({ item }) => {
    const targetId = targets[item.rewardID] ?? "";
    const enough = currentMember.memberPoints >= item.rewardCost;
    const missing = Math.max(0, item.rewardCost - currentMember.memberPoints);
    const canClaim = enough && !!targetId;

    return (
      <View style={[styles.itemRow, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.firstRow}>
          <View style={styles.formRow}>
            <Text
              style={{
                color: theme.colors.onSurface,
                fontFamily: fontButton,
                fontSize: 16,
              }}
            >
              {item.rewardName}
            </Text>
            <Text
              style={{
                color: theme.colors.onSurface,
                fontFamily: fontBody,
                fontSize: 14,
              }}
            >
              {item.rewardDescription}
            </Text>

            <View style={styles.costRow}>
              <Ionicons
                size={16}
                name="ribbon-outline"
                color={theme.colors.primary}
              />
              <Text
                style={{
                  color: theme.colors.primary,
                  fontFamily: fontBody,
                  fontSize: 14,
                }}
              >
                {item.rewardCost} points
              </Text>
            </View>
          </View>
          <View style={styles.pictureContainer}>
            <Image
              style={styles.rewardPicture}
              source={{ uri: item.rewardImage }}
            />
          </View>
        </View>
        <View>
          <View
            style={[
              styles.pickerWrap,
              { backgroundColor: theme.colors.background },
            ]}
          >
            <Picker
              selectedValue={targetId}
              onValueChange={(v) => setTarget(item.rewardID, v as string)}
              style={[
                styles.picker,
                { color: theme.colors.onBackground, fontFamily: fontTitle },
              ]}
              itemStyle={[
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.onBackground,
                  fontFamily: fontTitle,
                },
              ]}
            >
              <Picker.Item label="Choisir une cible…" value="" />
              {members.map((m) => (
                <Picker.Item
                  key={m.memberId}
                  label={m.memberUsername}
                  value={m.memberId}
                />
              ))}
            </Picker>
          </View>

          <TouchableOpacity
            disabled={!canClaim}
            onPress={() => canClaim && handleClaim(item)}
            style={[
              styles.claimButton,
              { backgroundColor: theme.colors.primary },
              !canClaim && { backgroundColor: theme.colors.secondary },
            ]}
          >
            <Text
              style={{
                color: theme.colors.onBackground,
                fontFamily: fontButton,
                fontSize: 14,
              }}
            >
              {canClaim
                ? "Récupérer"
                : enough
                ? "Choisir une cible"
                : `Il vous manque ${missing} points`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
          Récompenses
        </Text>
      </View>

      <View style={styles.profileHeader}>
        <Image
          style={styles.avatar}
          source={{
            uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              currentMember.memberUsername || "Membre"
            )}&background=${cleanHex(theme.colors.primary)}&color=ffffff`,
          }}
        />
        <View>
          <Text
            style={{
              color: theme.colors.onSurface,
              fontFamily: fontButton,
              fontSize: 16,
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {currentMember.memberUsername}
          </Text>
          <View style={styles.pointsRow}>
            <Ionicons
              size={20}
              name="ribbon-outline"
              color={theme.colors.primary}
            />
            <Text
              style={{
                color: theme.colors.primary,
                fontFamily: fontBody,
                fontSize: 16,
              }}
            >
              {currentMember.memberPoints} points
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.rewardsListTitle}>
        <Text
          style={{
            color: theme.colors.onSurface,
            fontFamily: fontButton,
            fontSize: 16,
          }}
        >
          Récompenses disponibles
        </Text>
      </View>

      <FlatList<Reward>
        data={rewards}
        keyExtractor={(item) => item.rewardID}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
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
  profileHeader: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 20,
    gap: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  pointsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  rewardsListTitle: {
    width: "100%",
    marginLeft: 6,
  },
  itemRow: {
    flexDirection: "column",
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 10,
  },

  firstRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 12,
  },
  formRow: {
    flex: 1,
    marginRight: 12,
    gap: 6,
  },
  costRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  pictureContainer: {
    width: 80,
    height: 80,
  },
  rewardPicture: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
    resizeMode: "cover",
  },

  pickerWrap: {
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 12,
  },
  picker: {
    height: Platform.OS === "ios" ? 150 : 50,
    width: "100%",
  },

  claimButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  claimButtonText: {
    fontWeight: "600",
    fontSize: 14,
  },
});
