import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import styled from "styled-components/native";
import { useDB } from "../context";
import colors from "../colors";
import { AdMobInterstitial, AdMobRewarded } from "expo-ads-admob";

const View = styled.View`
    flex: 1;
    background-color: ${colors.bgColor};
    padding: 0px 30px;
`;
const Title = styled.Text`
    color: ${colors.textColor};
    margin: 50px 0;
    text-align: center;
    font-size: 28px;
    font-weight: 500;
`;

const TextInptut = styled.TextInput`
    background-color: white;
    border-radius: 10px;
    padding: 10px 20px;
    font-size: 18px;
`;

const Btn = styled.TouchableOpacity`
    width: 100%;
    margin-top: 30px;
    background-color: ${colors.btnColor};
    padding: 10px 20px;
    align-items: center;
    border-radius: 20px;
`;
const BtnText = styled.Text`
    color: white;
    font-size: 18px;
    font-weight: 500;
`;

const Emotions = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 20px;
`;
const Emotion = styled.TouchableOpacity`
    background-color: white;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
    padding: 10px;
    border-radius: 10px;
    border-width: ${(props) => (props.selected ? "2px" : "0px")};
    border-color: rgba(0, 0, 0, 0.5);
`;
const EmotionText = styled.Text`
    font-size: 24px;
`;
const emotions = ["😆", "😍", "🤬", "😱", "😭", "😶‍🌫️"];

const Write = ({ navigation: { goBack } }) => {
    const realm = useDB();
    const [selectedEmotion, setSelectedEmtion] = useState(null);
    const [feelings, setFeelings] = useState("");
    const onChangeText = (text) => setFeelings(text);
    const onEmotionPress = (face) => setSelectedEmtion(face);
    const onSubmit = async () => {
        if (feelings === "" || selectedEmotion === null) {
            return Alert.alert("Please complete form");
        }

        await AdMobRewarded.setAdUnitID(
            "ca-app-pub-3940256099942544/1712485313"
        );
        await AdMobRewarded.requestAdAsync({ servePersonalizedAds: true });
        await AdMobRewarded.showAdAsync();
        AdMobRewarded.addEventListener("rewardedVideoUserDidEarnReward", () => {
            AdMobRewarded.addEventListener("rewardedVideoDidDismiss", () => {
                realm.write(() => {
                    const feeling = realm.create("Feeling", {
                        _id: Date.now(),
                        emotion: selectedEmotion,
                        message: feelings,
                    });
                });
                goBack();
            });
        });
    };
    return (
        <View>
            <Title>How do you feel today?</Title>
            <Emotions>
                {emotions.map((emotion, index) => (
                    <Emotion
                        selected={emotion === selectedEmotion}
                        onPress={() => onEmotionPress(emotion)}
                        key={index}>
                        <EmotionText>{emotion}</EmotionText>
                    </Emotion>
                ))}
            </Emotions>

            <TextInptut
                returnKeyType="done"
                onSubmitEditing={onSubmit}
                value={feelings}
                onChangeText={onChangeText}
                placeholder="Write your feelings...."
            />
            <Btn onPress={onSubmit}>
                <BtnText>Save</BtnText>
            </Btn>
        </View>
    );
};

export default Write;
