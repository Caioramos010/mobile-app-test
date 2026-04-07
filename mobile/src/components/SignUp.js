import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signUp } from '../services/authService'; 

export default function SignUp() {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleNavigateToSignIn = () => {
        navigation.navigate('SignIn');
    };

    const handleSignUp = async () => {
        try {
            await signUp(name, email, password);
            navigation.navigate('SignIn', { registeredEmail: email });
        } catch (error) {
            alert(error.message || 'Erro ao cadastrar');
        }
    };

    const isFormValid =
        name.length > 0 &&
        email.length > 0 &&
        password.length > 0 &&
        confirmPassword.length > 0 &&
        password === confirmPassword;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Nome</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite seu nome"
                    value={name}
                    onChangeText={setName}
                />
            </View>

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

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirmação de Senha</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Confirme sua senha"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
            </View>

            <Pressable
                style={[styles.button, !isFormValid && styles.buttonDisabled]}
                onPress={handleSignUp}
                disabled={!isFormValid}
            >
                <Text style={[styles.buttonText, !isFormValid && styles.buttonTextDisabled]}>Registrar</Text>
            </Pressable>

            <Pressable style={styles.footerButton} onPress={handleNavigateToSignIn}>
                <Text style={styles.footerText}>Voltar</Text>
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