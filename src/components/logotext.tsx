import { Image } from "expo-image";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { colors } from "../theme/theme";

export const LogoWithText = ({
  text1,
  text2,
  text3,
}: {
  text1: string;
  text2: string;
  text3: string;
}) => {
  return (
    <View
      style={{
        alignItems: "center",
      }}
    >
      <Image
        source={require("../assets/images/logo_cidade_em_foco.png")}
        contentFit="contain"
        style={{ width: "100%", height: 100 }}
      />
      <View
        style={{
          flexDirection: "row",
          display: "flex",
          gap: 6,
          justifyContent: "center",
          alignItems: "baseline",
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            color: colors.brandBlue,
            fontSize: 30,
          }}
        >
          {text1}
        </Text>
        <Text
          style={{
            fontWeight: "100",
            color: colors.brandGreen,
            fontSize: 25,
          }}
        >
          {text2}
        </Text>
        <Text
          style={{
            fontWeight: "900",
            color: colors.brandGreen,
            fontSize: 30,
          }}
        >
          {text3}
        </Text>
      </View>
    </View>
  );
};

export const LogoWithTextSideBySide = ({
  text1,
  text2,
  text3,
}: {
  text1: string;
  text2: string;
  text3: string;
}) => {
  return (
    <View
      style={{
        alignItems: "center",
      }}
    >
      <Image
        source={require("../assets/images/logo_cidade_em_foco.png")}
        contentFit="contain"
        style={{ width: "100%", height: 100 }}
      />
      <View
        style={{
          flexDirection: "column",
          display: "flex",
          gap: 6,
          justifyContent: "center",
          alignItems: "baseline",
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            color: colors.brandBlue,
            fontSize: 30,
          }}
        >
          {text1}
        </Text>
        <Text
          style={{
            fontWeight: "100",
            color: colors.brandGreen,
            fontSize: 25,
          }}
        >
          {text2}
        </Text>
        <Text
          style={{
            fontWeight: "900",
            color: colors.brandGreen,
            fontSize: 30,
          }}
        >
          {text3}
        </Text>
      </View>
    </View>
  );
};
