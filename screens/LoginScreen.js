import { useEffect, useState } from 'react';
import {
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Dimensions,
  Platform,
} from 'react-native';

const initialState = {
  login: '',
  pass: '',
};

const LoginScreen = () => {
  const [showPass, onShowPass] = useState(true);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [state, setState] = useState(initialState);

  const [dimensions, setDimensions] = useState({
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width - 16 * 2,
  });
  // const [dimensions, setDimensions] = useState(Dimensions.get('window').width - 16 * 2);
  // console.log(Platform.OS);

  const keyboarHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
    console.log(state);
  };

  const onShow = () => onShowPass(prevShow => !prevShow);

  useEffect(() => {
    const onChange = () => {
      const width = Dimensions.get('window').width - 16 * 2;
      const height = Dimensions.get('window').height;
      console.log({ height, width }, dimensions);
      setDimensions({ height, width });
    };
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={keyboarHide}>
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/images/photo_bg.jpg')}
          resizeMode="cover"
          style={styles.image}
        >
          <View
            style={{
              ...styles.form,
              paddingBottom: !isShowKeyboard && dimensions.width < dimensions.height ? 100 : 32,
            }}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.containerRegistrationScreen}
            >
              <Text style={styles.text}>Login</Text>
              <SafeAreaView>
                <View style={styles.ViewLoginInput}>
                  <TextInput
                    onChangeText={value => setState(prevState => ({ ...prevState, login: value }))}
                    placeholder="Login"
                    placeholderTextColor="#BDBDBD"
                    style={styles.input}
                    onFocus={() => setIsShowKeyboard(true)}
                  />
                </View>

                <View style={styles.ViewPassInput}>
                  <TextInput
                    style={styles.input}
                    placeholder={'Password'}
                    placeholderTextColor="#BDBDBD"
                    secureTextEntry={showPass}
                    onFocus={() => setIsShowKeyboard(true)}
                    onChangeText={value => setState(prevState => ({ ...prevState, pass: value }))}
                  />
                  <TouchableOpacity
                    style={{ position: 'absolute', right: 16, top: 16 }}
                    onPress={onShow}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.buttonShow}>Show</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={keyboarHide} activeOpacity={0.7}>
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
              </SafeAreaView>
              <TouchableOpacity
                style={styles.buttonComeIn}
                onPress={keyboarHide}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonTextComeIn}>Don't have an account? Register</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  form: {
    marginTop: 'auto',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  text: {
    fontFamily: 'Roboto-Regular',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 35,
    lineHeight: 45,
    textAlign: 'center',
    letterSpacing: 0.01,
    color: '#212121',
    marginBottom: 32,
    marginTop: 32,
  },
  buttonShow: {
    fontFamily: 'Roboto-Regular',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
    color: '#1B4371',
  },

  ViewLoginInput: {
    marginBottom: 16,
    marginLeft: 16,
    marginRight: 16,
  },
  ViewMailInput: {
    marginBottom: 16,
    marginLeft: 16,
    marginRight: 16,
  },
  ViewPassInput: {
    position: 'relative',
    marginBottom: 43,
    marginLeft: 16,
    marginRight: 16,
  },
  input: {
    fontSize: 16,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    lineHeight: 19,
    borderStyle: 'solid',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    backgroundColor: '#F6F6F6',
  },
  containerRegistrationScreen: {},
  button: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    paddingRight: 32,
    paddingLeft: 32,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16,
    backgroundColor: '#FF6C00',
    borderRadius: 100,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
  },
  buttonComeIn: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  buttonTextComeIn: {
    color: '#1B4371',
    fontFamily: 'Roboto-Regular',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
  },
});

export default LoginScreen;
