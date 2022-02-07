import React, { useCallback, useEffect, useState } from 'react';
import { HistoryCard } from '../../components/HistoryCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { categories } from '../../utils/categories';
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale'; 

import {
    Container,
    Header,
    Title,
    Content,
    ChartContainer,
    MonthSelect,
    MonthSelectButton,
    MonthSelectSelectIcon,
    Month,
    LoadContainer
} from './styles';
import { ActivityIndicator } from 'react-native';


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
    const [isLoading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const theme = useTheme();


    function handleDateChange(action: 'next' | 'previous'){
        if(action === 'next'){
            setSelectedDate(addMonths(selectedDate, 1));
        }else{
            setSelectedDate(subMonths(selectedDate, 1));
        }
    }

    async function loadData(){
        setLoading(true);
        const dataKey = "@gofinance:transaction";
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];

        const expensives = responseFormatted
        .filter((expensive:TransactionData) => 
            expensive.type === 'negative' && 
            new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
            new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
        );



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
        setLoading(false);
    }

    useFocusEffect(useCallback(() => {
        loadData();
    },[selectedDate]));

    return(
        <Container>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>

        {
            isLoading === true 
            ? 
            <LoadContainer> 
                <ActivityIndicator  color={theme.colors.primary} size="large"/> 
            </LoadContainer> 
            :
            <Content
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingBottom: useBottomTabBarHeight(),
                }}
            >
                <MonthSelect>
                    <MonthSelectButton onPress={() => handleDateChange('previous')}>
                        <MonthSelectSelectIcon name="chevron-left"/>
                    </MonthSelectButton>

                    <Month>
                        {format(selectedDate, "MMMM, YYY", {locale: ptBR})}
                    </Month>

                    <MonthSelectButton onPress={() => handleDateChange('next')}>
                        <MonthSelectSelectIcon name="chevron-right"/>
                    </MonthSelectButton>
                </MonthSelect>


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
        }
        </Container>
    )
}