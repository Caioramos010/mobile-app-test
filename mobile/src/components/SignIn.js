import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { signIn } from '../services/authService';

export default function SignIn() {
    const navigation = useNavigation();
    const route = useRoute();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (route.params?.registeredEmail) {
            setEmail(route.params.registeredEmail);
        }
    }, [route.params?.registeredEmail]);

    const handleNavigateToSignUp = () => {
        navigation.navigate('SignUp');
    };

    // ✅ agora chama a API
    const handleLogin = async () => {
        try {
            await signIn(email, password);
            navigation.navigate('Home');
        } catch (error) {
            alert(error.message || 'Erro ao fazer login');
        }
    };

    const isFormValid = email.length > 0 && password.length > 0;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign In</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite seu usuário"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Senha</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite sua senha"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
            </View>

            <Pressable
                style={[styles.button, !isFormValid && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={!isFormValid}
            >
                <Text style={[styles.buttonText, !isFormValid && styles.buttonTextDisabled]}>Entrar</Text>
            </Pressable>

            <Pressable style={styles.footerButton} onPress={handleNavigateToSignUp}>
                <Text style={styles.footerText}>Não possui conta ainda? Crie agora.</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2ABFFC',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 40,
    },
    inputContainer: {
        width: '100%',
        maxWidth: 320,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#555',
        marginBottom: 8,
        alignSelf: 'flex-start',
    },
    input: {
        fontSize: 16,
        color: '#333',
        backgroundColor: '#b2e9ff70',
        borderWidth: 1.5,
        borderColor: '#2ABFFC',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        width: '100%',
    },
    button: {
        backgroundColor: '#C0C0C0',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    buttonDisabled: {
        backgroundColor: '#E0E0E0',
        elevation: 0,
        shadowOpacity: 0,
    },
    buttonText: {
        color: '#666',
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    buttonTextDisabled: {
        color: '#A0A0A0',
    },
    footerButton: {
        marginTop: 25,
    },
    footerText: {
        color: '#777',
        fontSize: 14,
    },
});