import React, { useState } from 'react';
import { FloatingAction } from "react-native-floating-action";
import { colorPalette } from "../constants/color";
import { actions } from "../constants/actions";
import ManualWaterInputModal from "./ManualWaterInputModal";

const AddWaterButton = ({ dispatch, userId, action }) => {
    const [manualModalVisible, setManualModalVisible] = useState(false);

    const handlePressItem = (name) => {
        if (name === "manual") {
            setManualModalVisible(true);
        } else {
            action(dispatch, userId, name);
        }
    };

    return (
        <>
            <FloatingAction
                color={colorPalette.tertiary}
                actions={actions}
                position="right"
                onPressItem={handlePressItem}
            />
            <ManualWaterInputModal
                visible={manualModalVisible}
                onClose={() => setManualModalVisible(false)}
                onSave={async (amount) => {
                    await action(dispatch, userId, amount);
                }}
            />
        </>
    )
}

export default AddWaterButton;
