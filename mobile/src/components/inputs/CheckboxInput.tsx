import { Text, View } from "react-native";
import { Checkbox, CheckboxProps } from "react-native-paper";
import { colors } from "../../theme/theme";

type InputCheckboxProps = CheckboxProps & {
  label?: string;
};

export const InputCheckbox = ({ label, ...props }: InputCheckboxProps) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Checkbox
        {...props}
        color={props.color ?? colors.brandBlue}
        uncheckedColor={props.uncheckedColor ?? colors.brandBlue}
      />

      {label && (
        <Text
          style={{
            color: colors.checkboxFontColor,
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          {label}
        </Text>
      )}
    </View>
  );
};
