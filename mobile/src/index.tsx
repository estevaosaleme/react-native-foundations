import React, { useEffect, useState } from 'react';
import { Text, StatusBar, FlatList, SafeAreaView, TouchableOpacity, View, StyleSheet, Linking } from 'react-native';

import api from './../services/api';

interface Repository {
    id: string;
    title: string;
    url: string;
    stack: [];
    likes: number;
}

export default function App() {

    const [repositories, setRepositories] = useState<Repository[]>([]);

    useEffect(() =>{
        api.get('repositories').then(response => {
            setRepositories(response.data);
        });
    }, []);  

    async function handleLike(id:string){
        await api.post(`/repositories/${id}/like`);
        const repo = (await api.get('repositories')).data;
        setRepositories(repo);
    }

    return (
        <>
        <SafeAreaView style={styles.container}>
            
            <Text style={styles.title}>List of Repositories</Text>
            
            {repositories.length > 0 ? 
                (<FlatList  
                    data={repositories}
                    keyExtractor={ repository => repository.id }
                    renderItem={({item: repository}) => (
                    <>
                        <Text style={styles.defaultText}>{repository.title} has {repository.likes} likes</Text>
                        <Text style={styles.defaultText}>Stack: {repository.stack.join(', ')}</Text>
                        <Text onPress={() => Linking.openURL(repository.url)} style={styles.textUrl}>URL: {repository.url}</Text>
                        <TouchableOpacity style={styles.button} activeOpacity={0.6} onPress={() => handleLike(repository.id)}>
                            <Text style={styles.buttonText}>Like</Text>
                        </TouchableOpacity>
                        <View style={styles.separator} />
                    </>
                    )}
                    />
                )
                : (
                    <Text>The list is empty</Text>
                )
            }
        
        </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#b7d0f1',
        justifyContent: 'center',
        alignItems: 'center'
    },

    title: {
        color: '#000',
        fontSize: 32,
        fontWeight: 'bold'
    },

    defaultText: {
        color: '#000',
        fontSize: 16
    },

    textUrl: {
        color: '#000',
        fontSize: 16,
        textDecorationLine: 'underline'
    },

    button: {
        backgroundColor: '#FFF',
        marginHorizontal: 80,
        marginVertical: 10,
        height: 40,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        fontWeight: 'bold',
        fontSize: 16
    },

    separator: {
        borderBottomColor: '#000',
        borderBottomWidth: 1
    }

});