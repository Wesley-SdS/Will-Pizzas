import React, { useState } from "react";
import { Alert, Platform, ScrollView, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage';



import { ButtonBack } from "@components/ButtonBack";
import { Photo } from "@components/Photo";
import { Input } from "@components/Input";
import { InputPrice } from "@components/inputPrice";
import { Button } from "@components/Button";

import {
  Container,
  DeleteLabel,
  Header,
  Title,
  Upload,
  PickImageButton,
  Form,
  Label,
  InputGroup,
  InputGroupHeader,
  MaxCharacters,
} from "./style";

export function Product() {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setdescription] = useState("");
  const [priceSizeBrotinho, setSizeBrotinho] = useState("");
  const [priceSizeGrande, setpriceSizeGrande] = useState("");
  const [isLoading, setisLoading] = useState(false);

  async function handleImagePicker() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 4],
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    }
  }

  async function handleAdd(){
    if(!name.trim()){
      return Alert.alert('Cadastro', 'Informe o nome do produto.')

    }

    if(!description.trim()){
      return Alert.alert('Cadastro', 'Informe a descrição do produto.')

    }

    if(!image){
      return Alert.alert('Cadastro', 'Selecione a image do produto.')

    }

    if(!priceSizeBrotinho || !priceSizeGrande){
      return Alert.alert('Cadastro', 'Informe o valor de todos os produto.')

    }
    
    setisLoading(true);

    const fileName = new Date().getTime();
    const reference = storage().ref(`/pizzas/${fileName}.png`);

    await reference.putFile(image);
    const photo_url = await reference.getDownloadURL();

    firestore()
    .collection('pizzas')
    .add({
      name,
      name_insensitive: name.toLowerCase().trim(),
      description,
      prices_sizes: {
        brotinho: priceSizeBrotinho,
        grande: priceSizeGrande,

      },
      photo_url,
      photo_path: reference.fullPath
    })
    .then(() => Alert.alert('Cadastro', 'Pizza cadastrada com sucesso.'))
    .catch(() => Alert.alert('Cadastro', 'Não foi possível cadastrar a pizza.'))

    setisLoading(false);
  }


  return (
    <Container behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
          <ButtonBack />

          <Title>Cadastrar Produtos</Title>
          <TouchableOpacity>
            <DeleteLabel>Deletar</DeleteLabel>
          </TouchableOpacity>
        </Header>
        <Upload>
          <Photo uri={image} />
          <PickImageButton
            style={{ borderRadius: 8 }}
            title="Carregar"
            type="secondary"
            onPress={handleImagePicker}
          />
        </Upload>
        <Form>
          <InputGroup>
            <Label>Nome</Label>
            <Input onChangeText={setName} value={name} />
          </InputGroup>

          <InputGroup>
            <InputGroupHeader>
              <Label>Descrição</Label>
              <MaxCharacters>0 de 60 caracteres</MaxCharacters>
            </InputGroupHeader>

            <Input
              multiline
              maxLength={200}
              style={{ height: 80 }}
              onChangeText={setdescription}
              value={description}
            />
          </InputGroup>

          <InputGroup>
            <Label>Tamanhos e Preços</Label>

            <InputPrice
              size="Brotinho"
              onChangeText={setSizeBrotinho}
              value={priceSizeBrotinho}
            />
            <InputPrice
              size="Grande"
              onChangeText={setpriceSizeGrande}
              value={priceSizeGrande}
            />
          </InputGroup>

          <Button
            title="Cadastrar Pizza"
            style={{ borderRadius: 10 }}
            isLoading={isLoading}
            onPress={handleAdd}
          />
        </Form>
      </ScrollView>
    </Container>
  );
}
