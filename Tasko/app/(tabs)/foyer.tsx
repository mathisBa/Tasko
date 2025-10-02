import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
  StyleSheet,
} from "react-native";
import { useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

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

export default function Foyer() {
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
              item.memberUsername || "Membre"
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
            {item.memberUsername}{" "}
            {item.memberId === user.memberId ? "(Vous)" : ""}
          </Text>
          <Text
            style={{
              color: theme.colors.onSurface,
              fontFamily: fontBody,
            }}
          >
            {item.memberId === foyerOwnerID ? "Propriétaire" : "Membre"}
          </Text>
        </View>
      </View>
      <TouchableOpacity>
        <Ionicons size={22} name="trash-outline" color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  );

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
          Foyer
        </Text>
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
        data={data}
        keyExtractor={(item) => item.memberId}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />

      <TouchableOpacity
        style={[styles.bottomButton, { backgroundColor: theme.colors.primary }]}
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
