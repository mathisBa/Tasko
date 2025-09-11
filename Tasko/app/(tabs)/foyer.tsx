import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
  SafeAreaView,
  StyleSheet,
} from "react-native";

type Member = {
  memberId: string;
  memberUsername: string;
  memberXP: number;
  memberPoints: number;
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

const data: Member[] = [...members].sort((a, b) => b.memberXP - a.memberXP);

const renderItem: ListRenderItem<Member> = ({ item, index }) => (
  <View style={styles.rowMember}>
    <View style={styles.rowProfile}>
      <Text>{index + 1}</Text>

      <Image
        style={styles.avatar}
        source={{
          uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            item.memberUsername || "Membre"
          )}`,
        }}
      />

      <View>
        <Text>{item.memberUsername}</Text>
        <Text>
          XP {item.memberXP} · Points {item.memberPoints}
        </Text>
      </View>
    </View>
    <TouchableOpacity>
      <Text>⋮</Text>
    </TouchableOpacity>
  </View>
);

export default function Foyer() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Foyer</Text>
      <FlatList<Member>
        data={data}
        keyExtractor={(item) => item.memberId}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  title: {
    color: "black",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  avatar: {
    width: 44,
    aspectRatio: 1 / 1,
    borderRadius: 22,
  },
  rowMember: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  rowProfile: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
});
