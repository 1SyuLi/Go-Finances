import React, {useState, useEffect} from "react";
import { Modal, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from "../../components/Forms/Input";
import { InputForm } from "../../components/Forms/inputForm";
import { Button } from "../../components/Forms/Button";
import { TransactionTypeButton } from "../../components/Forms/TransactionTypeButton";
import { CategorySelect } from "../../components/Forms/CategorySelect";

import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";

import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

import { CategorySelected } from "../CategorySelected";

import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsTypes,
} from './styles';

interface FormData{
    name: string,
    amount: string,
}

const Schema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    amount: Yup.number().typeError('Informe um valor numérico').positive('O valor não pode ser negativo').required('O valor é obrigatório'),
})

const dataKey = "@gofinance:transaction";

export function Register(){

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    });

    const Navigation = useNavigation();

    const { control,formState: {errors}, handleSubmit, reset } = useForm({
        resolver: yupResolver(Schema),
    });


    const [transactionType, setTransactionType] = useState('');
    const [CategoryModalOpen, setCategoryModalOpen] = useState(false);

    

    function handleTransactionsTypeSelect(type: 'positive' | 'negative'){
        setTransactionType(type);
    }

    function handleOpenSelectCategoryModal(){
        setCategoryModalOpen(true)
    }

    function handleCloseSelectCategoryModal(){
        setCategoryModalOpen(false)
    }

async function handleRegister(form:FormData){

        if(!transactionType) return Alert.alert('selecione o tipo da transação');
        if(category.key === 'category') return Alert.alert('Selecione o tipo da categoria');


        const NewTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date(),
        }

        try {
            
            const data = await AsyncStorage.getItem(dataKey);
            const currentData = data ? JSON.parse(data) : [];

            const dataFormated = [
                ...currentData,
                NewTransaction
            ]

            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormated));

            setTransactionType('');
            setCategory({
                key: 'category',
                name: 'Categoria',
            });
            reset();

            Navigation.goBack();

        } catch (error) {
            console.log(error)
            Alert.alert('Não foi possivel salvar');
        }
    }

    useEffect(() => {
        async function LoadData(){
            const data = await AsyncStorage.getItem(dataKey);
        }

        LoadData();

        // async function removeAll(){
        //      await AsyncStorage.removeItem(dataKey);
        //  }

        //  removeAll();
    }, []);

    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
            <Header>
                <Title>Cadastro</Title>
            </Header>


            <Form>
                <Fields>
                    <InputForm error={errors.name && errors.name.message} control={control} name="name" placeholder="Nome" autoCapitalize="sentences" autoCorrect={false}/>
                    <InputForm error={errors.amount && errors.amount.message} control={control} name="amount" placeholder="Preço" keyboardType="numeric"/>

                    <TransactionsTypes>
                        <TransactionTypeButton type="positive" title="Income" onPress={() => handleTransactionsTypeSelect('positive')} isActive={transactionType === 'positive'}/>
                        <TransactionTypeButton type="negative" title="Outcome" onPress={() => handleTransactionsTypeSelect('negative')} isActive={transactionType === 'negative'}/>
                    </TransactionsTypes>
                    
                    <CategorySelect title={category.name} onPress={handleOpenSelectCategoryModal}/>
                </Fields>
                

                <Button title="Enviar" onPress={handleSubmit(handleRegister)}/>
            </Form>

            <Modal visible={CategoryModalOpen}>
                <CategorySelected 
                    Category={category}
                    setCategory={setCategory}
                    closeSelectCategory={handleCloseSelectCategoryModal}
                />
            </Modal>
        </Container>
        </TouchableWithoutFeedback>
    )
}