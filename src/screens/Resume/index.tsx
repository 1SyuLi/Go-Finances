import React, { useCallback, useEffect, useState } from 'react';
import { HistoryCard } from '../../components/HistoryCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { categories } from '../../utils/categories';
import { VictoryPie } from 'victory-native';

import {
    Container,
    Header,
    Title,
    Content,
    ChartContainer,
} from './styles';
import { useFocusEffect } from '@react-navigation/native';


interface TransactionData{
    id: string;
    type: 'positive' | 'negative';
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface CategoryData{
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
}


export function Resume(){
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

    async function loadData(){

        const dataKey = "@gofinance:transaction";
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];

        const expensives = responseFormatted
        .filter((expensive:TransactionData) => expensive.type === 'negative');

        const totalByCategory: CategoryData[] = [];

        categories.forEach(category => {
            let categorySum = 0;

            expensives.forEach((expensive: TransactionData) => {
                if(expensive.category === category.key){
                    categorySum += Number(expensive.amount)
                }
            })

            if(categorySum > 0){
                const totalFormatted = categorySum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                });


                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    color: category.color,
                    total: categorySum,
                    totalFormatted,
                })
            }

        })

        setTotalByCategories(totalByCategory);
    }

    useEffect(() => {
        loadData();
    }, []);

    useFocusEffect(useCallback(() => {
        loadData();
    },[]));

    return(
        <Container>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>

            <ChartContainer>
                    <VictoryPie
                        height={300} 
                        data={totalByCategories}
                        x="name"
                        y="total"

                    />
            </ChartContainer>


            <Content>
            {
                totalByCategories.map(item => (
                    <HistoryCard
                        key={item.key} 
                        title={item.name}
                        amount={item.totalFormatted}
                        color={item.color}
                    />
                ))
            }
            </Content>


        </Container>
    )
}