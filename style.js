import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    //https://material.io/guidelines/style/color.html#color-color-palette
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: "100%"
    },
    innerContainer: {
        height: "80%",
        width: "90%",
    },
    containerTop: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    grayHeader: {
        backgroundColor: "#fff",
        width: "100%",
        padding: 20,
        marginTop: 24,
        flex: 0,
        alignItems: 'center',
    },
    grayFooter: {
        backgroundColor: "#e8e8e8",
        width: "100%",
        paddingTop: 20,
        paddingBottom: 40,
        flex: 0,
        alignItems: 'center'
    },
    h1: {
        width: "90%",
        margin: 10,
        fontSize: 24,
        color: "#666",
        textAlign: 'center'
    },
    moverListItem: {
        paddingBottom: 20,
    },
    bigButton: {
        backgroundColor: "#00796B",
        width: "90%",
        padding: 10,
        margin: 10,
        alignItems: "center"
    },
    jobDetailDesc: {
        fontSize: 12,
        fontWeight: 'bold',
        alignItems: 'flex-start'
    },
    jobDetailInfo: {
        fontSize: 18,
        marginBottom: 10,
        alignItems: 'flex-start'
    },
    jobDetailRow: {
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#999"
    },
    formField: {
        height: 40,
        width: "90%",
        marginTop: 10,
    },
    errorText: {
        color: '#b20808',
        fontSize: 10,
    },
    navigation: {
        flex: 1,
    },
    gallery: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    flipButton: {
        flex: 0.3,
        height: 40,
        marginHorizontal: 2,
        marginBottom: 10,
        marginTop: 20,
        borderRadius: 8,
        borderColor: 'white',
        borderWidth: 1,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flipText: {
        color: 'white',
        fontSize: 15,
    },
    item: {
        margin: 4,
        backgroundColor: 'indianred',
        height: 35,
        width: 80,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    picButton: {
        backgroundColor: 'darkseagreen',
    },
    galleryButton: {
        backgroundColor: 'indianred',
    },
    row: {
        flexDirection: 'row',
    },
    container2: {
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: 'ivory',
    },

});