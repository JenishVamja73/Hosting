import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  contanier: {
    marginVertical: 5,
  },
  mainUrlView: {
    marginHorizontal: 5,
    marginVertical: 5,
    marginLeft: "1%",
    flex: 1
  },
  urlView: {
    flexDirection: 'row',
    // justifyContent: 'space-evenly',
    alignItems: 'center',

  },
  urlWEbText: {
    fontSize: 25,
    color: "black",
    fontWeight: "500"
  },
  urlTextInput: {
    borderColor: 'black',
    // borderWidth: 1,
    // width: '60%',
    borderRadius: 10,
    fontSize: 15,
    color: "black",
    fontWeight: "500",
    // left:"80%"
  },
  NameView: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  TextInputName: {
    borderColor: 'black',
    borderWidth: 1,
    width: '60%',
    borderRadius: 10,
  },
  statusCodeView: {
    marginVertical: 10,
  },
  
  
  dropdown: {
    height: 40,
    borderColor: 'black',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    width: 330,
    color: "black",
    borderWidth: 1,


  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "black"
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  AddView: {
   position:"absolute",
   top:"94%",
   width:"100%"
  }

});
export default styles;
