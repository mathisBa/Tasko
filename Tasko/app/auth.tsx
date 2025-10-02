import React, {useContext, useState} from 'react';
import {Pressable, StyleSheet, TextInput, View} from 'react-native';
import {ThemedText} from '@/components/ThemedText';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as Crypto from 'expo-crypto';
import {StateContext} from "@/app/StateContext";
import {useRouter} from "expo-router";

export default function AuthScreen() {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const insets = useSafeAreaInsets();
    const {userId, setUserId} = useContext(StateContext);

    const handleSubmit = () => {
        let data = {
            email: email,
            password: password,
        }
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
            }).then(async (response) => {
                const data = await response.json();
                console.log("User profile", data.user);
                console.log("User token", data.jwt);
                setUserId(data.user.id);
                router.replace('/foyer');
            }).catch((error) => {
                console.log("An error occurred:", error);
            });
        } else {
            (data as any).username = username;
            // (data as any).memberId = Crypto.randomUUID();
            // (data as any).memberFoyer = null;
            // (data as any).memberXP = 0;
            // (data as any).memberPoints = 0;
            fetch(`${apiUrl}/api/auth/local/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }).then(async response => {
                if (response.ok) {
                    setIsLogin(true);
                    const responseData = await response.json();
                    setUserId(responseData.user.id);
                } else {
                    console.log("Response pas ok : ", response.status);
                }
            }).catch(error => {
                console.error("Erreur lors de l'inscription", error);
            })
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right }]}>
            <ThemedText type="title" style={styles.title}>
                {isLogin ? 'Connexion' : 'Inscription'}
            </ThemedText>

            {!isLogin && (
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#888"
                    value={username}
                    onChangeText={setUsername}
                    keyboardType="default"
                    autoCapitalize="none"
                />
            )}

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Pressable style={styles.button} onPress={handleSubmit}>
                <ThemedText style={styles.buttonText}>
                    {isLogin ? 'Se connecter' : "S'inscrire"}
                </ThemedText>
            </Pressable>

            <Pressable onPress={() => setIsLogin(!isLogin)} style={styles.toggleButton}>
                <ThemedText style={styles.toggleText}>
                    {isLogin ? 'Pas de compte ? Inscrivez-vous' : 'Déjà un compte ? Connectez-vous'}
                </ThemedText>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1B1611',
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    title: {
        marginBottom: 48,
        textAlign: 'center',
        color: 'white',
    },
    input: {
        backgroundColor: '#3d2d1d',
        color: 'white',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 16,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#ed8c37',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: '#1B1611',
        fontWeight: 'bold',
        fontSize: 16,
    },
    toggleButton: {
        marginTop: 24,
        alignItems: 'center',
    },
    toggleText: {
        color: '#ed8c37',
    },
});
