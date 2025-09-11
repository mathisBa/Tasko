import {
  View,
  Text,
  Image,
  FlatList,
  ListRenderItem,
  StyleSheet,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ScrollView } from "react-native-gesture-handler";

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
  memberPoints: 30,
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

const renderItem: ListRenderItem<Reward> = ({ item, index }) => (
  <View>
    <View>
      <Image
        style={styles.rewardPicture}
        source={{
          uri: item.rewardImage,
        }}
      />
      <Text>{index}</Text>
    </View>
  </View>
);

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
    width: 100,
    aspectRatio: 2 / 1,
  },
});
