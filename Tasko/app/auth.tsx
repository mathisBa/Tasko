import React, { useContext, useState } from "react";
import {
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { StateContext } from "@/app/StateContext";
import { useRouter } from "expo-router";
import { useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

export default function AuthScreen() {
  const theme = useTheme();
  const fontBody = theme.fonts.bodyMedium.fontFamily;
  const fontButton = theme.fonts.labelMedium.fontFamily;
  const fontTitle = theme.fonts.titleMedium.fontFamily;

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { userId, setUserId } = useContext(StateContext);

  const handleSubmit = () => {
    let data = {
      email: email,
      password: password,
    };
    if (isLogin) {
      fetch(`${apiUrl}/api/auth/local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: email,
          password: password,
        }),
      })
        .then(async (response) => {
          const data = await response.json();
          console.log("User profile", data.user);
          console.log("User token", data.jwt);
          setUserId(data.user.id);
          router.replace("/foyer");
        })
        .catch((error) => {
          console.log("An error occurred:", error);
        });
    } else {
      (data as any).username = username;
      fetch(`${apiUrl}/api/auth/local/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then(async (response) => {
          if (response.ok) {
            const responseData = await response.json();
            const memberData = {
              memberFoyer: null,
              memberXP: 0,
              memberPoints: 0,
              userId: responseData.user.id,
            };
            fetch(`${apiUrl}/api/members`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ data: memberData }),
            })
              .then(async (response) => {
                if (response.ok) {
                  setIsLogin(true);
                  setUserId(responseData.user.id);
                } else {
                  console.log("Response member pas ok : ", response.status);
                }
              })
              .catch((error) => {
                console.error("Erreur lors de la création du member", error);
              });
          } else {
            console.log("Response register pas ok : ", response.status);
          }
        })
        .catch((error) => {
          console.error("Erreur lors de l'inscription", error);
        });
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            router.push("/");
          }}
        >
          <Ionicons
            name="arrow-back-outline"
            size={28}
            color={theme.colors.onBackground}
          />
        </Pressable>

        <Text
          style={[
            styles.title,
            {
              color: theme.colors.onBackground,
              fontFamily: fontTitle,
            },
          ]}
        >
          {isLogin ? "Connexion" : "Inscription"}
        </Text>

        <View style={{ width: 28 }} />
      </View>

      <View style={styles.formContainer}>
        {!isLogin && (
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.surface,
                color: theme.colors.onSurface,
                fontFamily: fontBody,
              },
            ]}
            placeholder="Nom d'utilisateur"
            placeholderTextColor="#888"
            value={username}
            onChangeText={setUsername}
            keyboardType="default"
            autoCapitalize="none"
          />
        )}

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.surface,
              color: theme.colors.onSurface,
              fontFamily: fontBody,
            },
          ]}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.surface,
              color: theme.colors.onSurface,
              fontFamily: fontBody,
            },
          ]}
          placeholder="Mot de passe"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[
            styles.bottomButton,
            { backgroundColor: theme.colors.primary },
          ]}
          onPress={handleSubmit}
        >
          <Text
            style={{
              color: theme.colors.onBackground,
              fontFamily: fontButton,
              fontSize: 14,
            }}
          >
            {isLogin ? "Se connecter" : "S'inscrire"}
          </Text>
        </TouchableOpacity>

        <Pressable
          onPress={() => setIsLogin(!isLogin)}
          style={styles.toggleButton}
        >
          <Text
            style={{
              color: theme.colors.onBackground,
              fontFamily: fontBody,
            }}
          >
            {isLogin
              ? "Pas de compte ? Inscrivez-vous"
              : "Déjà un compte ? Connectez-vous"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
  },
  formContainer: {
    flex: 1,
    alignItems: "stretch",
    gap: 10,
    paddingTop: 25,
  },
  input: {
    height: 50,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
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
  toggleButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});
