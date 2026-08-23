import { TextInput, TextInputProps } from "react-native-paper";
import { colors } from "../../theme/theme";

type InputTextProps = TextInputProps;

export const InputText = (props: InputTextProps) => {
  return (
    <TextInput
      {...props}
      style={[
        {
          ...props.style,
          backgroundColor: colors.inputBackground,
          borderRadius: 14,
          color: colors.brandBlue,
          textDecorationColor: colors.brandBlue,
          borderBlockColor: colors.brandBlue,
          borderColor: colors.brandBlue,
          borderWidth: 0.1,
          fontWeight: "bold",
          fontSize: 16,
        },
        props.style,
      ]}
      underlineStyle={{ display: "none" }}
    />
  );
};
