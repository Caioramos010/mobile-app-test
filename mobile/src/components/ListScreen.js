import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, Alert, ActivityIndicator } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { getPasswords, deletePassword } from '../services/passwordService';

function PasswordItem({ item, onRemove }) {
    const [isHidden, setIsHidden] = useState(true);

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(item.password);
        Alert.alert('Copiado!', 'Senha copiada para a área de transferência.');
    };

    return (
        <View style={styles.item}>
            <View style={styles.itemInfo}>
                <Text style={styles.appName}>{item.site}</Text>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.password}>
                    {isHidden ? '•'.repeat(item.password.length) : item.password}
                </Text>
                <Text style={styles.date}>
                    {new Date(item.created_at).toLocaleDateString()}
                </Text>
            </View>

            <View style={styles.actions}>
                <Pressable style={styles.actionButton} onPress={() => setIsHidden(!isHidden)}>
                    <Text style={styles.emoji}>{isHidden ? '👁️' : '🙈'}</Text>
                </Pressable>

                <Pressable style={styles.actionButton} onPress={copyToClipboard}>
                    <Text style={styles.emoji}>📋</Text>
                </Pressable>

                <Pressable style={styles.actionButton} onPress={() => onRemove(item.id)}>
                    <Text style={styles.emoji}>🗑️</Text>
                </Pressable>
            </View>
        </View>
    );
}

export default function ListScreen() {
    const [passwords, setPasswords] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPasswords = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getPasswords();
            setPasswords(data);
        } catch (error) {
            Alert.alert('Erro', error.message || 'Erro ao buscar senhas');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPasswords();
    }, [fetchPasswords]);

    const removePassword = async (id) => {
        try {
            await deletePassword(id);
            setPasswords((prev) => prev.filter(item => item.id !== id));
        } catch (error) {
            Alert.alert('Erro', error.message || 'Erro ao remover senha');
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#2ABFFC" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={passwords}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <PasswordItem item={item} onRemove={removePassword} />
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Nenhuma senha salva ainda.</Text>
                        </View>
                    }
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    listContent: {
        padding: 20,
    },
    item: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#eee',
    },
    itemInfo: {
        flex: 1,
        marginRight: 10,
    },
    appName: {
        fontSize: 14,
        color: '#2ABFFC',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    username: {
        fontSize: 13,
        color: '#888',
        marginBottom: 4,
    },
    password: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        letterSpacing: 2,
        fontFamily: 'monospace',
    },
    date: {
        fontSize: 12,
        color: '#999',
        marginTop: 6,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        padding: 8,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emoji: {
        fontSize: 20,
        color: '#333',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 18,
        color: '#bbb',
        fontWeight: '500',
    },
});
