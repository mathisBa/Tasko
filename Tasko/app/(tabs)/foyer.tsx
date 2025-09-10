import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Household() {
  const members = [
    {
      name: "Ethan Carter",
      role: "Owner",
      roleColor: "#fbb86a",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIuozCNUIdCuIzlzFLRFxqXz5yw7Ko-xkXpeVd00oS6oa_RdNVH8p7fwkdiWm9kDzHkUcQN1vGmo5IwwZp-4FaMhZUsELQcOG5XcTbA7lYzWLmAoOii_hBOAz8UYMIcmORDn_bq7jl2_nqw7sbE3QELb23Hgbt5IrLTDNRap5YZX8gy_200fj7dcap9NIVOffKyNjj0Hb7WuBVzb0FsOF6eLeuZ9-rwOa4ePufmgj19NDY3XgmHhZ18ikTDAsDQwk5Wvc8vkhnzit6",
    },
    {
      name: "Sophia Bennett",
      role: "Member",
      roleColor: "#bbaea8",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdbnov7_PlGm4IWtGqV1Whk7MBWtD3xUxG-gXwKewX09JOh_-AN1u1-rQ33qqTITymwwAxAGEH4cP-g6JfJdUSXI3LXJ5VQsI5qrD4GNMJAwVcNzV0wToaT1VJhEH8ebghRgSZdpCQ6KEaXa6lmazv5he_CXW409vHGOWMnOoOlITq6K9fdXyoPaN-vcgDbSPkrvvTNcdFaAv5oH4pSOu6fxHfyi1EQ82Xw34TFLL-uAynSdwDSSRiWy421cHTpgTJ0oxMrID_FyFF",
    },
    {
      name: "Liam Harper",
      role: "Member",
      roleColor: "#bbaea8",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlP7sS-h_WZsGJQorCZbDOmOEqs_JgcsrdQ0I-8QHlsOxyoDxXq_VdaYrjHnL2GPV-j_vdxy-E20bsHAh6OuBj1NERjniPYhvX8j45FXIpwhuUlPq5g-u76XjQXqX5joPocAZMFgQqGZOH7xAJxZC9oKD8kO1MeD1XGlFnZRgr8UvE6yhcY-OqBUuvwnRuy4Eny9JZCjnVedsQYKifoiY6nUVAgE1jsP9Yu96NL1fzILTsd1goW0VR6gMuTW6BiuDElqpx6qVljSHE",
    },
    {
      name: "Olivia Hayes",
      role: "Member",
      roleColor: "#bbaea8",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWT2TJYWBTcL2NeRn1Ad_yycDWiPjUucd0uBsNeiQZEczvU6Vgps509LokKlNYwjp6dGbCpDab5ha08TKYOzGw-FmKyY-fC8SNRklqFvyMemz8ksslTeZMEX6RVZU6nzHUueg-fNoJC4LCuQQHCLh8Q9f2HOAAGoUX5WtfDJhjQq6XIziMQlP13IMuPTqdNdXJQruYXb0vaMxzFgA6UErJkOn_2Q73CPUGd9vENDYRxxGmTDNXNWP-be7IzFy5rUQjJclfypfg1LJA",
    },
    {
      name: "Noah Foster",
      role: "Member",
      roleColor: "#bbaea8",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfPVlBmjLwCzoqsi9RjCSt7jlXNDVLP23QEBbYHGwDC-2XJzSIvx4_Z4Ym57-4TwF9uGYAqDFC0s0NC98ITB8fu0WmPLH-l9wnzvUbLTmRrjm4nduiw9KA1l-dls2w6Tit38KpCV-nS_W-jD_2bcfdiDDUp-6bbe78276BvoYDd1K6JO2SY9RIpsTvmThth6CsyzhIiRz7kjeiiRG-HEpWRw65Gq7JDl65bQb0Dh3NRHkquSgaKRdTNU56GSZQpYbaJGp8TYlzN_SF",
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#231910" }}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn}>
            <Text style={{ color: "white" }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Household</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Members */}
        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>Members</Text>
          {members.map((m, idx) => (
            <View key={idx} style={styles.memberCard}>
              <View style={styles.memberLeft}>
                <Image source={{ uri: m.img }} style={styles.avatar} />
                <View>
                  <Text style={styles.memberName}>{m.name}</Text>
                  <Text style={[styles.memberRole, { color: m.roleColor }]}>
                    {m.role}
                  </Text>
                </View>
              </View>
              <TouchableOpacity>
                <Text style={{ color: "white" }}>⋮</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Add Member button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.addBtn}>
            <Text style={styles.addIcon}>＋</Text>
            <Text style={styles.addText}>Add Member</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const PRIMARY = "#f97306";
const SECONDARY_950 = "#231910";
const SECONDARY_900 = "#3a2d29";

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "rgba(35,25,16,0.8)",
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { color: "white", fontSize: 20, fontWeight: "bold" },
  content: { paddingHorizontal: 16 },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: 16,
  },
  memberCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: SECONDARY_900 + "80",
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  memberLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  memberName: { color: "white", fontSize: 16, fontWeight: "600" },
  memberRole: { fontSize: 13, fontWeight: "500" },
  footer: { padding: 16 },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 28,
    backgroundColor: PRIMARY,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
    gap: 8,
  },
  addIcon: { color: "white", fontSize: 20 },
  addText: { color: "white", fontSize: 18, fontWeight: "bold" },
});
