import { StyleSheet, View, Button } from "react-native";
import ImageCropper from "./ImageCropper";
import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from "react";
import { Image } from "react-native";

export default function App() {
  const cropper = useRef();

  const [image, setImage] = useState();

  const handleImageSelection = async () => {
    await ImagePicker.requestMediaLibraryPermissionsAsync();
    const res = await ImagePicker.launchImageLibraryAsync();
    // uri, angle (0, 90, 180, 270, -90, -180, -270)
    // cropper.current.rotate(res.assets[0].uri, 270).then((res) => setImage(res));
    
    // uri, crop x, crop y, crop width, crop height
    cropper.current.crop(res.assets[0].uri, 0, 100, 200, 200).then((res) => setImage(res));
  };

  const source = {
    uri: image,
  };
  return (
    <View style={styles.container}>
      <ImageCropper utilsRef={cropper} />
      {/* output below */}
      <Image
        source={source}
        style={{
          resizeMode: "center",
          height: 300,
          width: 300,
        }}
      />
      <Button onPress={handleImageSelection} title="Select Image" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
