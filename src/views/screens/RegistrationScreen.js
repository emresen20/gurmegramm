import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import {
ALERT_TYPE,
Dialog,
AlertNotificationRoot,
Toast
} from 'react-native-alert-notification';
import Input from "../components/input";
import Loader from "../components/Loader";
import gurmeLogo from "../../img/Dreks.png"
import Button from "../components/Button";
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegistrationScreen = ({ navigation }) => {
  const [inputs, setInputs] = React.useState({
    email: "",
    fullname: "",
    phone: "",
    gender: "",
    password: "",
    passwordConfirm: "",

  });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const validate = () => {
    let isValid = true;

    if (!inputs.email) {
      handleError("Please Enter a E-mail", "email");
      isValid = false;
    } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
      handleError("Please Enter a Valid E-mail Adress", "email");
      isValid = false;
    }
    if (!inputs.fullname) {
      handleError("Please Enter a Full name", "fullname");
      isValid = false;
    }
    if (!inputs.phone) {
      handleError("Please Enter a Phone Number", "phone");
      isValid = false;
    }
    if (!inputs.gender) {
      handleError("Please Enter a Gender", "gender");
      isValid = false;
    }
    if (!inputs.password) {
      handleError("Please Enter a Password", "password");
      isValid = false;
    } else if (inputs.password.length < 8) {
      handleError("Minimum Password Length is 8", "password");
      isValid = false;
    }
    if (!inputs.passwordConfirm) {
      handleError("Please Enter a PasswordConfirm", "passwordConfirm");
      isValid = false;
    } else if (inputs.passwordConfirm != inputs.password) {
      handleError("Password Confirmation does not match", "passwordConfirm");
    isValid = false;
    }

    if (isValid) register();
  };

  const register = () => {
    console.log("register!");
    console.log(inputs);

    setLoading(true);
    setTimeout(() => {
      try {
        setLoading(false);
        AsyncStorage.setItem("userData", JSON.stringify(inputs));

        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "User Successfully Created!",
          button: "Close",
          onHide: () => {
            navigation.navigate("LoginScreen");
          },
        });
      } catch (error) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "ERROR",
          textBody: error,
          button: "Close",
        });
      }
    }, 3000);
  };

  const handleOnChange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };
  const handleError = (text, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: text }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <AlertNotificationRoot>
        <Loader visible={loading} />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Image style={styles.image} source={gurmeLogo} />
          <Text style={styles.textTilte}>Registration Form</Text>
          <Text style={styles.textSubTilte}>
            Enter Your Details to Register
          </Text>
          <Input
            label="Email Adress"
            iconName="at"
            placeholder="Enter your Email adress"
            onChangeText={(text) => handleOnChange(text, "email")}
            onFocus={() => handleError(null, "email")}
            error={errors.email}
          />

          <Input
            label="Full Name"
            iconName="user"
            placeholder="Enter your Full Name (ex: Emre Sen)"
            onChangeText={(text) => handleOnChange(text, "fullname")}
            onFocus={() => handleError(null, "fullname")}
            error={errors.fullname} 
          />
          <Input
            label="Phone Number"
            iconName="mobile"
            placeholder="Enter your phone number "
            onChangeText={(text) => handleOnChange(text, "phone")}
            onFocus={() => handleError(null, "phone")}
            error={errors.phone}
          />
          <Input
            label="Gender"
            iconName="venus-mars"
            placeholder="Enter your Gender (Male-Female)"
            onChangeText={(text) => handleOnChange(text, "gender")}
            onFocus={() => handleError(null, "gender")}
            error={errors.gender}
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
          <Input
            label="Confirm Password"
            iconName="key"
            password
            placeholder="Enter your Confirm Password"
            onChangeText={(text) => handleOnChange(text, "passwordConfirm")}
            onFocus={() => handleError(null, "passwordConfirm")}
            error={errors.passwordConfirm}
          />

          <Button title="Register" onPress={validate} />
        </ScrollView>
      </AlertNotificationRoot>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  scrollContainer: {
    paddingTop: 30,
    paddingHorizontal: 10,
  },
  textTilte: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",

  },
  textSubTilte: {
    fontSize: 18,
    color: "black",
    marginVertical: 5,

  },
  image: {
    width: 250,
    height: 250,
    alignSelf: 'center',
  },


});
export default RegistrationScreen;