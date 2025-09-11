import {
  View,
  Text,
  Image,
  FlatList,
  ListRenderItem,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

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

function handleClaim(item: Reward) {
  // logique de réclamation
}

const renderItem: ListRenderItem<Reward> = ({ item }) => {
  const canClaim = user.memberPoints >= item.rewardCost;
  const missing = Math.max(0, item.rewardCost - user.memberPoints);

  return (
    <View style={styles.itemRow}>
      <View style={styles.formRow}>
        <View style={styles.costRow}>
          <MaterialCommunityIcons
            name="trophy-award"
            size={18}
            color="orange"
          />
          <Text style={styles.pointsCount}>{item.rewardCost} points</Text>
        </View>

        <Text style={styles.itemTitle}>{item.rewardName}</Text>
        <Text style={styles.itemSub}>{item.rewardDescritpion}</Text>

        <TouchableOpacity
          disabled={!canClaim}
          onPress={() => canClaim && handleClaim(item)}
        >
          <Text
            style={canClaim ? styles.claimButton : styles.claimButtonDisabled}
          >
            {canClaim ? "Récupérer" : `Il vous manque ${missing} points`}
          </Text>
        </TouchableOpacity>
      </View>

      <Image style={styles.rewardPicture} source={{ uri: item.rewardImage }} />
    </View>
  );
};

export default function Recompenses() {
  return (
    <View style={styles.container}>
      <Text>Récompenses</Text>
      <Image
        style={styles.avatar}
        source={{
          uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.memberUsername || "Membre"
          )}&background=ff9800&color=ffffff`,
        }}
      />
      <Text>{user.memberUsername}</Text>
      <View style={styles.pointsRow}>
        <MaterialCommunityIcons name="trophy-award" size={24} color="orange" />
        <Text style={styles.pointsCount}>{user.memberPoints} points</Text>
      </View>
      <FlatList<Reward>
        style={styles.rewardsList}
        data={rewards}
        keyExtractor={(item) => item.rewardID}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "white",
  },
  avatar: {
    width: "30%",
    aspectRatio: 1 / 1,
    borderRadius: "100%",
    margin: 20,
  },
  pointsCount: {
    color: "orange",
  },
  pointsRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  rewardPicture: {
    width: "30%",
    aspectRatio: 2 / 1,
    borderRadius: 8,
    resizeMode: "cover",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    width: "100%",
    overflow: "hidden",
    flexWrap: "wrap",
    marginBottom: 30,
    backgroundColor: "grey",
    padding: 10,
    borderRadius: 10,
  },
  formRow: {
    width: "60%",
  },
  itemTitle: {
    fontWeight: "700",
    marginBottom: 2,
    color: "black",
  },
  itemSub: {
    color: "black",
    marginBottom: 6,
  },
  costRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  claimButton: {
    backgroundColor: "orange",
    padding: 10,
    width: "auto",
    borderRadius: 5,
  },
  claimButtonDisabled: {
    backgroundColor: "pink",
    padding: 10,
    width: "auto",
    borderRadius: 5,
  },
  rewardsList: {
    paddingVertical: 20,
  },
});
