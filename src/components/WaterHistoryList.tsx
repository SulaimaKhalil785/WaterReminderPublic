import {View} from "react-native";
import {homeStyle} from "../styles/styles";
import WaterRecordItem from "./WaterRecordItem";
import * as React from "react";

const WaterHistoryList = ({dailyWaterRecord}) => {
    if (dailyWaterRecord) {
        return (
            <View style={homeStyle.list}>
                {
                    dailyWaterRecord && dailyWaterRecord.map((waterRecord, index) => {
                        return (
                            <WaterRecordItem waterRecord={waterRecord} key={index}/>
                        )
                    })
                }
            </View>
        )
    } else {
        return <View style={homeStyle.list}/>;
    }
}

export default WaterHistoryList;