import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Pressable, TextInput, Modal, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from '@react-navigation/native';
import { generatePassword, savePassword } from '../services/passwordService';
import { signOut } from '../services/authService';

export default function Home() {
  const navigation = useNavigation();
  const [password, setPassword] = useState('GERE SUA SENHA');
  const [modalVisible, setModalVisible] = useState(false);
  const [site, setSite] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const setNewPassword = async () => {
    try {
      setLoading(true);
      const data = await generatePassword(12);
      setPassword(data.password);
    } catch (error) {
      Alert.alert('Erro', error.message || 'Erro ao gerar senha');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (password === 'GERE SUA SENHA') return;
    await Clipboard.setStringAsync(password);
    Alert.alert('Copiado!', 'Senha copiada para a área de transferência.');
  };

  const handleSavePassword = async () => {
    try {
      setLoading(true);
      await savePassword(site, username, password);
      setModalVisible(false);
      setSite('');
      setUsername('');
      Alert.alert('Salvo!', 'Senha salva com sucesso.');
    } catch (error) {
      Alert.alert('Erro', error.message || 'Erro ao salvar senha');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToHistory = () => {
    navigation.navigate('List');
  };

  const handleLogout = async () => {
    await signOut();
    navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
  };

  const isSaveEnabled = password !== 'GERE SUA SENHA';
  const isCreateEnabled = site.trim().length > 0 && username.trim().length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerador de Senhas</Text>
      <StatusBar style="auto" />

      <Image
        style={styles.tinyLogo}
        source={{
          uri:
            'https://img.freepik.com/vetores-premium/uma-ilustracao-de-desenho-animado-3d-de-um-cadeado-renderizado-com-um-unico_537368-5468.jpg?w=2000',
        }}
      />

      <View style={{ width: '100%', alignItems: 'center', marginTop: 10, gap: 15 }}>
        <Pressable style={styles.codeArea}>
          <Text style={styles.codeAreaText}>{password}</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={setNewPassword} disabled={loading}>
          <Text style={styles.codeAreaText}>{loading ? 'Gerando...' : 'Gerar Senha'}</Text>
        </Pressable>

        <Pressable
          style={[styles.button, !isSaveEnabled && styles.buttonDisabled]}
          onPress={copyToClipboard}
          disabled={!isSaveEnabled}
        >
          <Text style={styles.codeAreaText}>Copiar Senha</Text>
        </Pressable>

        <Pressable
          style={[styles.buttonSave, !isSaveEnabled && styles.buttonDisabled]}
          onPress={() => setModalVisible(true)}
          disabled={!isSaveEnabled}
        >
          <Text style={styles.codeAreaText}>Salvar</Text>
        </Pressable>

        <Pressable style={styles.buttonHistory} onPress={handleNavigateToHistory}>
          <Text style={styles.codeAreaText}>Ver Histórico</Text>
        </Pressable>

        <Pressable style={styles.buttonLogout} onPress={handleLogout}>
          <Text style={styles.codeAreaText}>Sair</Text>
        </Pressable>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Salvar Senha</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha Gerada</Text>
              <TextInput
                style={[styles.input, styles.inputReadOnly]}
                value={password}
                editable={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Site / Aplicativo</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Facebook, Gmail..."
                value={site}
                onChangeText={setSite}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Usuário / Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: seu@email.com"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.buttonModal, !isCreateEnabled && styles.buttonDisabled]}
                onPress={handleSavePassword}
                disabled={!isCreateEnabled || loading}
              >
                <Text style={styles.buttonText}>{loading ? 'Salvando...' : 'Criar'}</Text>
              </Pressable>

              <Pressable style={styles.buttonCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonTextCancel}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tinyLogo: {
    width: 200,
    height: 200,
  },
  codeArea: {
    backgroundColor: '#2ABFFC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: 'center',
    width: 200,
  },
  button: {
    backgroundColor: '#2ABFFC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: 'center',
    width: 200,
  },
  buttonSave: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: 'center',
    width: 200,
  },
  buttonHistory: {
    backgroundColor: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: 'center',
    width: 200,
  },
  buttonLogout: {
    backgroundColor: '#FF5252',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: 'center',
    width: 200,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  codeAreaText: {
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '85%',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2ABFFC',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputReadOnly: {
    backgroundColor: '#eee',
    color: '#888',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 15,
  },
  buttonModal: {
    backgroundColor: '#2ABFFC',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonCancel: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonTextCancel: {
    color: '#FF5252',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
