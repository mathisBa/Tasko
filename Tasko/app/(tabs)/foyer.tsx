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
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

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
const foyerOwnerID = "memberId125";
const user: Member = {
  memberId: "memberId124",
  memberUsername: "Benoit saint denis",
  memberXP: 720,
  memberPoints: 30,
};

const renderItem: ListRenderItem<Member> = ({ item, index }) => (
  <View style={styles.rowMember}>
    <View style={styles.rowProfile}>
      <Text>{index + 1}</Text>

      <Image
        style={styles.avatar}
        source={{
          uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            item.memberUsername || "Membre"
          )}&background=ff9800&color=ffffff`,
        }}
      />

      <View>
        <Text>
          {item.memberUsername}{" "}
          {item.memberId === user.memberId ? "(Vous)" : ""}
        </Text>
        <Text
          style={{
            color: item.memberId === foyerOwnerID ? "orange" : "black",
          }}
        >
          {item.memberId === foyerOwnerID ? "Propriétaire" : "Membre"}
        </Text>
      </View>
    </View>
    <TouchableOpacity>
      <MaterialCommunityIcons
        name="trash-can-outline"
        size={24}
        color="black"
      />
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
      <TouchableOpacity style={styles.bottomButton}>
        <Text>Add</Text>
        <MaterialCommunityIcons
          name="plus-circle-multiple-outline"
          size={24}
          color="black"
        />
      </TouchableOpacity>
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
  bottomButton: {
    position: "absolute",
    bottom: 100,
    backgroundColor: "orange",
    width: "90%",
    left: "5%",
    borderRadius: 20,
    opacity: 0.9,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    gap: 15,
  },
});
