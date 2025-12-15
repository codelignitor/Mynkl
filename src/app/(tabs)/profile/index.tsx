import { RootState } from '@/src/store';
import { logout, setProfile } from '@/src/store/slices/authSlice';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {  updatedUserProfile } from '../../../services/apis'; // adjust path as needed
import {
    View,
    Button,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const ProfileScreen = () => {
    const dispatch = useDispatch();
    const username = useSelector((state: RootState) => state.auth.username);
    const profileImage = useSelector((state: RootState) => state.auth.profile_picture);
    const userId = useSelector((state: RootState) => state.auth.user_id);

    const [isEditing, setIsEditing] = useState(false);
    const [editedUsername, setEditedUsername] = useState(username || '');
    const [editedProfileImage, setEditedProfileImage] = useState(profileImage || '');
    const [isLoading, setIsLoading] = useState(false);

    // ✅ Fetch user profile on first load
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (!userId) {
                    console.log('⚠️ No user ID found');
                    return;
                }

                const profileData = await updatedUserProfile(userId);
                console.log('✅ API Response:', profileData);

                if (profileData) {
                    setEditedUsername(profileData.name || '');
                    setEditedProfileImage(profileData.profile_pic || '');

                    // ✅ Save to Redux
                    dispatch(setProfile({
                        username: profileData.name,
                        profileImage: profileData.profile_pic
                    }));
                }
            } catch (error) {
                console.log("❌ Error fetching profile:", error);
            }
        };

        fetchProfile();
    }, [userId]);



    const handleLogout = () => {
        dispatch(logout());
        router.push('/(auth)');
    };

    const handleEditToggle = () => {
        if (isEditing) {
            // Cancel editing - reset to original values
            setEditedUsername(username || '');
            setEditedProfileImage(profileImage || '');
        }
        setIsEditing(!isEditing);
    };

    const handleImagePicker = async () => {
        try {
            // Request permission
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (permissionResult.granted === false) {
                Alert.alert("Permission required", "Permission to access camera roll is required!");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled) {
                setEditedProfileImage(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert("Error", "Failed to pick image");
        }
    };

   const handleSave = async () => {
  if (!editedUsername.trim()) {
    Alert.alert("Error", "Username cannot be empty");
    return;
  }

  setIsLoading(true);

  try {
    const formData = new FormData();

    // 👇 Important: value must be string
    formData.append('username', editedUsername.trim());

    if (editedProfileImage) {
      formData.append('profile_picture', {
        uri: editedProfileImage,
        type: 'image/png', // or 'image/jpeg'
        name: 'profile.png',
      });
    }

    // 🚀 Send via Axios
    const response = await axios.post('http://13.50.228.222:8000/profile/update-profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5MjVhM2Q3MC0xMTA4LTQ4MDYtYTVlMi03ZjE1NDBkNDQwOTQiLCJleHAiOjE3NTM2ODI1NjZ9.Iw5jzzCecHlXYOlZpEHBwQEp8KWVbRy6YdEiWr5KuDw`, // Replace with real token
      },
    });

    console.log('✅ Success:', response.data);
    Alert.alert('Success', 'Profile updated successfully');
    setIsEditing(false);
  } catch (error) {
    console.log('❌ API Error:', error?.response?.data || error.message);
    Alert.alert('Error', 'Failed to update profile.');
  } finally {
    setIsLoading(false);
  }
};


    console.log(editedProfileImage);
    return (
        <View style={styles.container}>
            {/* Profile Image Section */}
            <TouchableOpacity
                style={styles.imageContainer}
                onPress={isEditing ? handleImagePicker : undefined}
                disabled={!isEditing}
            >
                {editedProfileImage ? (
                    <Image
                        source={{ uri: editedProfileImage.startsWith('data:') || editedProfileImage.startsWith('http') ? editedProfileImage : `file://${editedProfileImage}` }}
                        style={styles.avatar}
                    />
                ) : (
                    <Ionicons name="person-circle-outline" size={100} color="#000" />
                )}
                {isEditing && (
                    <View style={styles.editImageOverlay}>
                        <Ionicons name="camera" size={24} color="#fff" />
                    </View>
                )}
            </TouchableOpacity>

            {/* Username Section */}
            {isEditing ? (
                <TextInput
                    style={styles.nameInput}
                    value={editedUsername}
                    onChangeText={setEditedUsername}
                    placeholder="Enter your name"
                    maxLength={50}
                />
            ) : (
                <Text style={styles.name}>{username || 'User Name'}</Text>
            )}

            {/* Edit/Save/Cancel Buttons */}
            <View style={styles.editButtonContainer}>
                {isEditing ? (
                    <View style={styles.editActionsContainer}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.saveButton]}
                            onPress={handleSave}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <Text style={styles.saveButtonText}>Save</Text>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.cancelButton]}
                            onPress={handleEditToggle}
                            disabled={isLoading}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.editButton]}
                        onPress={handleEditToggle}
                    >
                        <Ionicons name="pencil" size={16} color="#007AFF" />
                        <Text style={styles.editButtonText}>Edit Profile</Text>
                    </TouchableOpacity>
                )}
            </View>

              <TouchableOpacity
                        style={[styles.actionButton, styles.editButton]}
                        onPress={() => router.push('/mood_diary')}
                    >
                        <Text style={styles.editButtonText}>Mood Diay</Text>
                    </TouchableOpacity>

            {/* Navigation Options */}
            <View style={styles.navigationContainer}>
                <TouchableOpacity
                    style={styles.navigationItem}
                    onPress={() => router.push("/chat")}
                >
                    <Text style={styles.navigationText}>Chats</Text>
                    <Ionicons name="chevron-forward" size={24} color="black" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navigationItem}
                    onPress={() => router.push("/chat/room")}
                >
                    <Text style={styles.navigationText}>Chat Rooms</Text>
                    <Ionicons name="chevron-forward" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <View style={styles.buttonContainer}>
                <Button title="Logout" onPress={handleLogout} color="#d9534f" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#fff',
    },
    imageContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    editImageOverlay: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#007AFF',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    nameInput: {
        fontSize: 22,
        fontWeight: 'bold',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        textAlign: 'center',
        minWidth: 200,
    },
    editButtonContainer: {
        marginBottom: 24,
    },
    editActionsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        minWidth: 80,
        justifyContent: 'center',
    },
    editButton: {
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    editButtonText: {
        color: '#007AFF',
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#007AFF',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#888',
    },
    cancelButtonText: {
        color: '#888',
        fontWeight: '600',
    },
    navigationContainer: {
        width: '100%',
        marginBottom: 24,
    },
    navigationItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        width: '100%',
        paddingVertical: 12,
    },
    navigationText: {
        fontSize: 16,
    },
    buttonContainer: {
        width: '100%',
        marginVertical: 8,
    },
});

export default ProfileScreen;