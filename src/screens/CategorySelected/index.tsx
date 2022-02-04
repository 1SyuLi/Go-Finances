import React from "react";
import { FlatList } from "react-native";
import { Button } from "../../components/Forms/Button";
import { categories } from './../../utils/categories';

import { 
    Container,
    Header,
    Title,
    Icon,
    Name,
    Categorys,
    Separator,
    Footer,
 } from './styles';

 interface Category{
     key: string;
     name: string;
 }

 interface Props{
     Category: Category;
     setCategory: (category: Category) => void;
     closeSelectCategory: () => void;
 }


export function CategorySelected({
    Category, setCategory, closeSelectCategory
}:Props){

    function handleCategorySelect(category: Category){
        setCategory(category)
    }

    return(
        <Container>
            <Header>
                <Title>Categoria</Title>
            </Header>

            <FlatList 
                data={categories}
                style={{flex: 1, width: '100%'}}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => (
                    <Categorys onPress={() => handleCategorySelect(item)} isActive={Category.key === item.key}>
                        <Icon name={item.icon} />
                        <Name>{item.name}</Name>
                    </Categorys>
                )}
                ItemSeparatorComponent={() => <Separator />}
            />

            <Footer>
                <Button title="selecionar" onPress={closeSelectCategory}/>
            </Footer>
        </Container>
    )
}