import { StyleSheet } from 'react-native';

export const appScreensStyles = StyleSheet.create({
    // Common containers
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    whiteContainer: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 24,
    },
    // Header
    header: {
        backgroundColor: '#3498db',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
        marginTop: 5,
    },
    // Cards & sections
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    cardText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 8,
    },
    infoCard: {
        backgroundColor: '#e1f5fe',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
    },
    infoSection: {
        backgroundColor: '#e1f5fe',
        borderRadius: 10,
        padding: 20,
        marginVertical: 10,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#0277bd',
    },
    infoText: {
        fontSize: 14,
        color: '#0277bd',
        lineHeight: 20,
    },
    // Explore
    exploreCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardContent: {
        flex: 1,
    },
    cardDescription: {
        fontSize: 14,
        color: '#777',
    },
    cardIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f8ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Profile
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    email: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        margin: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    menuItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuItemText: {
        fontSize: 16,
        color: '#555',
    },
    logoutContainer: {
        margin: 15,
        marginTop: 5,
    },
    logoutButton: {
        backgroundColor: '#e74c3c',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Form
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#3498db',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});
