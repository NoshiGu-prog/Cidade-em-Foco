import { Controller, useFormContext } from "react-hook-form";
import { View } from "react-native";
import { Mask, formatWithMask } from "react-native-mask-input";
import { HelperText, TextInput, TextInputProps } from "react-native-paper";
import { colors } from "../../theme/theme";

export type InputMaskProps = Omit<
  TextInputProps,
  "value" | "onChangeText" | "onBlur"
> & {
  name: string;
  mask: Mask;
};

export const cpfMask: Mask = [
  /\d/,
  /\d/,
  /\d/,
  ".",
  /\d/,
  /\d/,
  /\d/,
  ".",
  /\d/,
  /\d/,
  /\d/,
  "-",
  /\d/,
  /\d/,
];

export const cepMask: Mask = [
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  "-",
  /\d/,
  /\d/,
  /\d/,
];

export const phoneMask: Mask = [
  "(",
  /\d/,
  /\d/,
  ")",
  " ",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  "-",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];

export const InputMask = (props: InputMaskProps) => {
  const { control } = useFormContext();
  const { name, mask, ...textInputProps } = props;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <View>
          <TextInput
            {...textInputProps}
            value={field.value ?? ""}
            onChangeText={(value) => {
              const { masked } = formatWithMask({
                text: value,
                mask,
              });

              field.onChange(masked);
            }}
            onBlur={field.onBlur}
            error={!!fieldState.error}
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
          <HelperText
            type="error"
            visible={!!fieldState.error?.message}
            style={{ padding: 0 }}
          >
            {fieldState.error?.message}
          </HelperText>
        </View>
      )}
    />
  );
};
