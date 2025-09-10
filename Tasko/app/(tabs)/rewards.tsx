import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RewardsScreen() {
  const PRIMARY = "#f97306";
  const BG = "#121212";

  const profile = {
    name: "Liam",
    points: 1250,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0h14d-1rCFD9qimUJYDoimst_QWHfP50lsJ2MdAqyAhJl1kPRNbl6KsHQyAS84pCrwuru1hsfzx3j29v0pAj1GrkzVRP0euV-XD34QELW2ODBxCTeamTmag3mMXOJ1uyJ6azgm4juFaltxNPIR-c_9bndM35X7-B319mkizQTaYanicYA1cE8X0bH7q_tN-7HQ3JeWmcxYWO1-8Uz8tYG080KDklGU1htHi8EJBH9usMGYo4MOeYtPA-ot55g4bV0Ra_eZk9W8OnY",
  };

  const rewards = [
    {
      title: "Movie Night",
      cost: 500,
      desc: "Enjoy a movie night with your family. Choose a movie, prepare snacks, and have a great time together.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCb1cv1uRfrzGsCtrw9_byuEI4WLN-PzwbpjZLYJaR0fzhCGXrASEBT-5WPNv3CV3r0wgFAhQ_ude94gbg9I2XClHX2hCRt5BzJgrcpgxneXaqz4-V-7oW1jPaiow9UqFVcbaewiiyyw42mmzUOfytSiP-nd8SFod_AyNBzLc002mrEsjgF2zv1y0kzt8kq-AD3_dHao5nlf6SHVZz30L7LgzAlRfSBrW_uEc7UqkN2V3aDNO1eTR51txT0kLbtHFIuNAmowiyNTtiy",
    },
    {
      title: "Pizza Party",
      cost: 1000,
      desc: "Order your favorite pizzas and have a fun pizza party with your family. Customize your pizzas and enjoy!",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-orkyTe2fUUo8F7L5QUwpiOKXAQirQejftIZKXZygpnpVkbn_vU9lMpdMnyVWVQajMhOQtKPNdUFOE4M2Mmj5P_284TvFCTYTCObk7IzmsUYICOm3PWGBcgwRMJYE02Uv-P0UvIqTJ1vjq7o-6rW3_q931CQfHfz3ICgPoyX7oIPFr_QO1nQuqdutowadN1o147rsUWR-TcWT-cb0QKYpnFE3-B50WJAeyaPpK8_sBDBWpdp7bmbanH1RI3VN91OXp4bmmF51zO9d",
    },
    {
      title: "Weekend Getaway",
      cost: 2000,
      desc: "Plan a weekend getaway to a nearby destination. Explore new places, relax, and create lasting memories.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJmDIGTSy4RxyuljjNlJsqNH3E34hRJWb9CDPWVFhd0TncByIQ1Iqm7CFDlXs5l5Qe9wBhP3jui_MlPiblb0DGmbjCk-HSh1REetaTBHPYm1CJiHiFV4my9kbcpAXQg0wU3QeEHHSvuZ3tEHidEPFsINcop0rE1sbFa5pYJPnoNoyJ6-cAexx0LmI87BnladcaN-lzIror3hFlYk7MCntgRClczl13MedTUuMicpNU0i1yDhXFGZ9ibyyT-LyX64zHi0B-T9Axwh8h",
    },
  ];

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: BG }]}
      edges={["top", "left", "right"]}
    >
      <StatusBar barStyle="light-content" />
      {/* Gradient overlay */}
      <View style={styles.gradientOverlay} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rewards</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
      >
        {/* Profile */}
        <View style={styles.center}>
          <Image source={{ uri: profile.img }} style={styles.avatar} />
          <View style={{ alignItems: "center", marginTop: 12 }}>
            <Text style={styles.name}>{profile.name}</Text>
            <View style={styles.pointsRow}>
              <Text style={[styles.pointsIcon, { color: PRIMARY }]}>★</Text>
              <Text style={[styles.pointsText, { color: PRIMARY }]}>
                {profile.points.toLocaleString()} points
              </Text>
            </View>
          </View>
        </View>

        {/* Rewards list */}
        <View style={{ marginTop: 8 }}>
          <Text style={styles.sectionTitle}>Available Rewards</Text>

          {rewards.map((r, idx) => (
            <View key={idx} style={styles.card}>
              <View style={styles.cardMain}>
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Text style={[styles.costIcon, { color: PRIMARY }]}>★</Text>
                    <Text style={styles.costText}>{r.cost} points</Text>
                  </View>
                  <Text style={styles.cardTitle}>{r.title}</Text>
                  <Text style={styles.cardDesc}>{r.desc}</Text>
                </View>

                <Image source={{ uri: r.img }} style={styles.thumb} />
              </View>

              <TouchableOpacity
                style={[styles.redeemBtn, { backgroundColor: PRIMARY }]}
              >
                <Text style={styles.redeemText}>Redeem</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* bottom safe area spacer */}
        <SafeAreaView edges={["bottom"]} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    backgroundColor: "rgba(249,115,6,0.2)",
    opacity: 0.6,
    transform: [{ translateY: -40 }],
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    filter: "blur(30px)", // ignored on native, harmless on web
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(18,18,18,0.5)",
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerIcon: { color: "white", fontSize: 18 },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    paddingRight: 10,
  },

  center: { alignItems: "center", gap: 12, marginTop: 8 },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.1)",
  },
  name: { color: "white", fontSize: 22, fontWeight: "800" },
  pointsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  pointsIcon: { fontSize: 18 },
  pointsText: { fontSize: 18, fontWeight: "600" },

  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    paddingVertical: 8,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  cardMain: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  costIcon: { fontSize: 14 },
  costText: { color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: "500" },
  cardTitle: { color: "white", fontSize: 18, fontWeight: "700", marginTop: 4 },
  cardDesc: { color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 4 },
  thumb: { width: 96, height: 96, borderRadius: 10, flexShrink: 0 },

  redeemBtn: {
    marginTop: 12,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 16,
  },
  redeemText: { color: "black", fontSize: 14, fontWeight: "700" },
});
