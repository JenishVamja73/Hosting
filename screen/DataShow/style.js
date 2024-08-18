import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  conter: {
    flex: 1,
    padding: 10,
  },
  SwipeListView: {
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 1,
    height: "100%"


  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    fontWeight: "500",
    color: "black"
  },
  itemUrl: {
    fontSize: 16,
    color: 'blue',
  },
  editView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    width: 80,
    height: "100%",
    backgroundColor: 'orange',
    left: 0,


  },
  DeletButTON: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 80,
    backgroundColor: 'red',
    right: 0,
  },
  AddView: {
    position: 'absolute',
    bottom: "20%",
    right: 20,
  },
  AddButton: {
    backgroundColor: 'blue',
    height: 60,
    width: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default styles;
