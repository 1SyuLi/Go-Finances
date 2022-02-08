import React, { useCallback, useEffect, useState, } from 'react';
import { ActivityIndicator } from 'react-native';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionsCard';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../hooks/auth';
import { useTheme } from 'styled-components';




import {
    Container,
    Header,
    UserContainer,
    UserInfo,
    Photo,
    User,
    UserGrettings,
    UserName,
    LogoufIcon,
    HighlightCards,
    Transactions,
    Title,
    TransactionsList,
    LogoufButton,
    LoadContainer
} from './styles';

interface HighlightProps {
    amount: string;
    lastTransaction: string;
}

interface HighlightData {
    entries: HighlightProps,
    expensives: HighlightProps,
    total: HighlightProps,
}


export function Dashboard() {

    const theme = useTheme();
    const { SignOut, user } = useAuth();

    function getLastTransactionDate(
        collection: TransactionCardProps[],
        type: 'positive' | 'negative'
    ){

        const lastTransactions = new Date(
            Math.max.apply(Math, collection
                .filter( transaction => transaction.type === type )
                .map( transaction => new Date(transaction.date).getTime())
        ))

        return `${lastTransactions.getDate()} de ${lastTransactions.toLocaleString('pt-BR', { month: 'long' })}`

    }

    const [isLoading, setIsLoading] = useState(true);

    const [transactions, setTransactions] = useState<TransactionCardProps[]>([]);
    const [highlightData, setHighLightData] = useState<HighlightData>({}as HighlightData);

    async function loadTransaction(){
        const dataKey = "@gofinance:transaction";


        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];

        let entriesTotal = 0;
        let expensiveTotal = 0;


        const transactionsFormatted: TransactionCardProps[] = transactions.map((item:TransactionCardProps) => {
            const amount = Number(item.amount).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL' });

             const date = Intl.DateTimeFormat('pt-Br', { day: '2-digit', month: '2-digit', year: '2-digit' }).format(new Date(item.date));

             if(item.type === 'positive'){
                entriesTotal += Number(item.amount);
             }else{
                 expensiveTotal += Number(item.amount);
             }

            return(
                {
                    id: item.id,
                    name: item.name,
                    amount,
                    type: item.type,
                    category: item.category,
                    date,
                }
            )
            
        });


        setTransactions(transactionsFormatted);



        const lastTransactionsEntries = getLastTransactionDate(transactions, 'positive');
        const lastTransactionsExpensives = getLastTransactionDate(transactions, 'negative');
        const totalInterval = `01 a ${lastTransactionsExpensives}`



        let total = entriesTotal - expensiveTotal;

        setHighLightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: `Última entrada dia ${lastTransactionsEntries}`,
            },
            expensives: {
                amount: expensiveTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: `Última entrada dia ${lastTransactionsExpensives}`,
            },
            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: totalInterval,
            },
        });

        setIsLoading(false);
    }

    useEffect(() => {
        loadTransaction();
    },[])

    useFocusEffect(useCallback(() => {
        loadTransaction();
      },[]));

    return (
        <Container>
            {
                isLoading === true 
                ? 
                    <LoadContainer> 
                        <ActivityIndicator  color={theme.colors.primary} size="large"/> 
                    </LoadContainer> 
                :
                <>
                    <Header>

                        <UserContainer>
                        <UserInfo>
                            <Photo
                                source={{ uri: user.photo }}
                            />
                            <User>
                                <UserGrettings>Olá,</UserGrettings>
                                <UserName>{user.name}</UserName>
                            </User>
                        </UserInfo>

                        <LogoufButton onPress={SignOut}>
                            <LogoufIcon name="power"/>
                        </LogoufButton>
                        </UserContainer>
        
                    </Header>

                    <HighlightCards>          
                        <HighlightCard 
                            type="up" 
                            title="Entradas" 
                            amount={highlightData.entries.amount} 
                            lastTransaction={highlightData.entries.lastTransaction}
                        />
                        <HighlightCard 
                            type="down" 
                            title="Saídas" 
                            amount={highlightData.expensives.amount} 
                            lastTransaction={highlightData.expensives.lastTransaction}
                        />
                        <HighlightCard 
                            type="total" 
                            title="Total" 
                            amount={highlightData.total.amount} 
                            lastTransaction={highlightData.total.lastTransaction}
                        />
                    </HighlightCards>


                    <Transactions>
                        <Title>Listagem</Title>

                        <TransactionsList 
                            data={transactions}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => <TransactionCard  key={item.id} data={item}/>}
                
                        />
                    </Transactions>
                </>
            }
        </Container>
    )
}