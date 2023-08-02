import React from "react";
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Image } from "react-native";
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import Input from "../components/input";
import Loader from "../components/Loader";
import gurmeLogo from "../../img/Dreks.png"
import Button from "../components/Button";
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'expo-dev-client';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';


const LoginScreen = ({ navigation }) => {
  GoogleSignin.configure({
    webClientId: "241615244083-9d193rlbant2shkm87b71iavtfnkcmji.apps.googleusercontent.com",
  });
  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();
  
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }
  
  const [inputs, setInputs] = React.useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const validate = async () => {
    let isValid = true;

    if (!inputs.email) {
      handleError("Please Enter a E-mail",    "email");
      isValid = false;
    } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
      handleError("Please Enter a Valid E-mail Adress",
        "email");
    }

    if (!inputs.password) {
      handleError("Please Enter a Password", "password");
      isValid = false;
    } else if (inputs.password.length < 8) {
      handleError("Minimum Password Length is 8", "password");
      isValid = false;
    }


    if (isValid) login();
  };
  const handleOnChange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };
  const handleError = (text, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: text }));
  };
  const login = () => {
    console.log("login!");
    console.log(inputs);

    setLoading(true);
    setTimeout(async () => {
      try {
        setLoading(false);
        let userData = await AsyncStorage.getItem("userData");

        if (userData) {
          userData = JSON.parse(userData);
          console.log("userData");
          console.log(userData);

          if (
            inputs.email == userData.email &&
            inputs.password == userData.password
          ) {
            navigation.navigate("HomeScreen");
            AsyncStorage.setItem(
              "userData",
              JSON.stringify({ ...userData, loggedIn: true })
            );
          } else {
            console.log("No Account Foundd");
            Dialog.show({
              type: ALERT_TYPE.DANGER,
              title: "ERROR",
              textBody: "Incorrect Username/Password!",
              button: "Close",
            });
          }
        } else {
          console.log("No Account Found");
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: "ERROR",
            textBody: "No Account Found!",
            button: "Close",
          });
        }
      } catch (error) {
        console.log("Error! " + error);
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "ERROR",
          textBody: error,
          button: "Close",
        });
      }
    }, 3000);
  };

  return (
    <AlertNotificationRoot style={styles.container}>
    <SafeAreaView style={styles.container}>
      <Loader visible={loading} />
      <ScrollView style={styles.svVontainer}>
        <Image style={styles.image} source={gurmeLogo} />
        <Text style={styles.textTilte}>Login</Text>
        <View style={styles.viewContainer}>
          <Input
            label="Email Address"
            iconName="envelope"
            placeholder="Enter your Email Address"
            onChangeText={(text) => handleOnChange(text, "email")}
            onFocus={() => handleError(null, "email")}
            error={errors.email}
          />
          <Input
            label="Password"
            iconName="key"
            password
            placeholder="Enter your Password"
            onChangeText={(text) => handleOnChange(text, "password")}
            onFocus={() => handleError(null, "password")}
            error={errors.password}
          />

          <Button title="Login" onPress={validate} />
          <Text
            style={styles.textRegister}
            onPress={() => navigation.navigate("RegistrationScreen")}
          >
            Don't have an account? Register
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  </AlertNotificationRoot>
);
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backroundColor: "white",
  },
  svVontainer: {
    paddingTop: 18,
    paddingHorizontal: 25,
  },
  image: {
    width: 250,
    height: 250,
    alignSelf: 'center',
  },
  textTilte: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    alignSelf:"center",

  },
  viewContainer: {
    paddingVertical: 20,
  },
  textRegister:{
    textAlign:"center",
    fontSize:16,
    color: "black",
    fontWeight: "bold",




  },

});
export default LoginScreen;