import React, { useCallback, useEffect, useState } from 'react';
import { HistoryCard } from '../../components/HistoryCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { categories } from '../../utils/categories';
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components'; 

import {
    Container,
    Header,
    Title,
    Content,
    ChartContainer,
} from './styles';


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
    percent: string;
}


export function Resume(){
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);
    const theme = useTheme();

    async function loadData(){

        const dataKey = "@gofinance:transaction";
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];

        const expensives = responseFormatted
        .filter((expensive:TransactionData) => expensive.type === 'negative');

        const expensivesTotal = expensives.reduce((acumullator: number, expensive: TransactionData) => {
            return acumullator + Number(expensive.amount)
        }, 0)

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

                const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`


                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    color: category.color,
                    total: categorySum,
                    totalFormatted,
                    percent,
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
                        data={totalByCategories}
                        colorScale={totalByCategories.map(category => category.color)}
                        style={{
                            labels: { 
                                fontSize: RFValue(18),
                                fontWeight: 'bold',
                                fill: theme.colors.shape,
                            }
                        }}
                        labelRadius={65}
                        x="percent"
                        y="total"
                        height={300} 

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