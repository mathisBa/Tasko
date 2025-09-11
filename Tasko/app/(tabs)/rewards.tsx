import {
  View,
  Image,
  FlatList,
  ListRenderItem,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Picker } from "@react-native-picker/picker";
import React, { useState, useCallback } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  rewardDescritpion: string;
  rewardImage: string;
};

const members: Member[] = [
  {
    memberId: "memberId124",
    memberUsername: "Benoit saint denis",
    memberXP: 720,
    memberPoints: 30,
  },
  {
    memberId: "memberId123",
    memberUsername: "Ethan Carter",
    memberXP: 750,
    memberPoints: 300,
  },
  {
    memberId: "memberId125",
    memberUsername: "Miley Cirus",
    memberXP: 50,
    memberPoints: 1,
  },
];

const user: Member = {
  memberId: "memberId124",
  memberUsername: "Benoit saint denis",
  memberXP: 720,
  memberPoints: 200,
};

const rewards: Reward[] = [
  {
    rewardID: "1",
    rewardName: "Envoyer une notification",
    rewardCost: 200,
    rewardDescritpion:
      "Vous avez la possibilité d'envoyer une notification à la personne de votre choix",
    rewardImage:
      "https://www.actu-juridique.fr/app/uploads/2023/10/AdobeStock_414232987-scaled.jpeg",
  },
  {
    rewardID: "2",
    rewardName: "Envoyer une notification",
    rewardCost: 250,
    rewardDescritpion:
      "Vous avez la possibilité d'envoyer une notification à la personne de votre choix",
    rewardImage:
      "https://www.actu-juridique.fr/app/uploads/2023/10/AdobeStock_414232987-scaled.jpeg",
  },
  {
    rewardID: "3",
    rewardName: "Envoyer une notification",
    rewardCost: 300,
    rewardDescritpion:
      "Vous avez la possibilité d'envoyer une notification à la personne de votre choix",
    rewardImage:
      "https://www.actu-juridique.fr/app/uploads/2023/10/AdobeStock_414232987-scaled.jpeg",
  },
  {
    rewardID: "4",
    rewardName: "Envoyer une notification",
    rewardCost: 400,
    rewardDescritpion:
      "Vous avez la possibilité d'envoyer une notification à la personne de votre choix",
    rewardImage:
      "https://www.actu-juridique.fr/app/uploads/2023/10/AdobeStock_414232987-scaled.jpeg",
  },
];

export default function Recompenses() {
  const [targets, setTargets] = useState<Record<string, string>>({});
  const insets = useSafeAreaInsets();

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
    const enough = user.memberPoints >= item.rewardCost;
    const missing = Math.max(0, item.rewardCost - user.memberPoints);
    const canClaim = enough && !!targetId;

    return (
      <ThemedView
        style={styles.itemRow}
        lightColor="#f9f9f9"
        darkColor="#1c1c1e"
      >
        <Image
          style={styles.rewardPicture}
          source={{ uri: item.rewardImage }}
        />
        <View style={styles.formRow}>
          <ThemedText type="subtitle" style={styles.itemTitle}>
            {item.rewardName}
          </ThemedText>
          <ThemedText style={styles.itemSub}>
            {item.rewardDescritpion}
          </ThemedText>

          <View style={styles.costRow}>
            <MaterialCommunityIcons
              name="trophy-award"
              size={18}
              color="orange"
            />
            <ThemedText style={styles.pointsCount}>
              {item.rewardCost} points
            </ThemedText>
          </View>

          <View style={styles.pickerWrap}>
            <Picker
              selectedValue={targetId}
              onValueChange={(v) => setTarget(item.rewardID, v as string)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
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
              !canClaim && styles.claimButtonDisabled,
            ]}
          >
            <ThemedText style={styles.claimButtonText}>
              {canClaim
                ? "Récupérer"
                : enough
                ? "Choisir une cible"
                : `Il vous manque ${missing} points`}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  };
  return (
    <ThemedView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <ThemedText type="title" style={styles.title}>
        Récompenses
      </ThemedText>
      <View style={styles.profileHeader}>
        <Image
          style={styles.avatar}
          source={{
            uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.memberUsername || "Membre"
            )}&background=ff9800&color=ffffff`,
          }}
        />
        <View>
          <ThemedText type="subtitle">{user.memberUsername}</ThemedText>
          <View style={styles.pointsRow}>
            <MaterialCommunityIcons
              name="trophy-award"
              size={24}
              color="orange"
            />
            <ThemedText style={styles.pointsCountLg}>
              {user.memberPoints} points
            </ThemedText>
          </View>
        </View>
      </View>
      <FlatList<Reward>
        style={styles.rewardsList}
        data={rewards}
        keyExtractor={(item) => item.rewardID}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    textAlign: "center",
    marginVertical: 20,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  pointsCount: {
    color: "orange",
    fontWeight: "600",
  },
  pointsCountLg: {
    color: "orange",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  pointsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  rewardPicture: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    resizeMode: "cover",
    marginBottom: 12,
  },
  itemRow: {
    marginBottom: 20,
    borderRadius: 10,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formRow: {
    width: "100%",
  },
  itemTitle: {
    marginBottom: 4,
  },
  itemSub: {
    marginBottom: 12,
    opacity: 0.7,
  },
  costRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  claimButton: {
    backgroundColor: "orange",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  claimButtonDisabled: {
    backgroundColor: "#E0E0E0",
  },
  claimButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  rewardsList: {
    flex: 1,
  },
  pickerWrap: {
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
    backgroundColor: Colors.dark.background,
    borderWidth: 1,
    borderColor: "#444",
  },
  picker: {
    height: 150,
    color: "white",
  },
  pickerItem: {
    color: "white",
    backgroundColor: Colors.dark.background,
  },
});
