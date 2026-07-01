import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView from 'react-native-maps';
import { styles } from './index.style';
import { useCreateEventLogic } from './CreateEventLogic';
import DateTimePickerModal from '@/src/components/common/dateTimePickerModal';

const CreateEventScreen = () => {
  const {
    // State values
    eventName,
    selectedMood,
    dateTime,
    location,
    maxAttendees,
    visibility,
    description,
    selectedImages,
    privacyEnabled,
    showVisibilityDropdown,
    showLocationModal,
    mapRegion,
    currentLocationName,
    visibilityOptions,
    moodTags,
    
    // Handlers
    setEventName,
    handleDateTimePress,
    setMaxAttendees,
    setDescription,
    setPrivacyEnabled,
    setShowVisibilityDropdown,
    setVisibility,
    setShowLocationModal,
    handleMapRegionChange,
    confirmLocation,
    handleCreateEvent,
    removeImage,
    handleGalleryPress,
    handleUploadPress,
    handleBackPress,
    setSelectedMood,
    selectedDate,
     setSelectedDate
  } = useCreateEventLogic();

  
  const [pickerVisible, setPickerVisible] = useState<boolean>(false);

   const handleConfirm = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create an Event</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Event Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Event Name</Text>
          <TextInput
            style={styles.textInput}
            value={eventName}
            onChangeText={setEventName}
            placeholder="Enter event name"
          />
        </View>

      <View style={styles.section}>
                 <Text style={styles.sectionTitle}>Mood Tag</Text>
                 <View style={styles.moodScrollContainer}>
                   <ScrollView 
                     horizontal 
                     showsHorizontalScrollIndicator={false}
                     contentContainerStyle={styles.moodScrollContent}
                   >
                     {moodTags.map((mood) => (
                       <TouchableOpacity
                         key={mood}
                         style={[
                           styles.moodTag,
                           selectedMood === mood && styles.selectedMoodTag,
                         ]}
                         onPress={() => setSelectedMood(mood)}
                         activeOpacity={0.7}
                       >
                         <Text
                           style={[
                             styles.moodTagText,
                             selectedMood === mood && styles.selectedMoodTagText,
                           ]}
                         >
                           {mood}
                         </Text>
                       </TouchableOpacity>
                     ))}
                   </ScrollView>
                 </View>
               </View>

        {/* Date and Time */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date and Time</Text>
          <TouchableOpacity onPress={()=>setPickerVisible(true)} style={styles.dateTimeInput}>
            <Text style={styles.dateTimeText}>{selectedDate.toLocaleString()}</Text>
          </TouchableOpacity>
        </View>

        {/* Add Locations */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Add Locations</Text>
          <TouchableOpacity 
            style={styles.locationInputContainer}
            onPress={() => setShowLocationModal(true)}
          >
            <Text style={[
              styles.locationTextInput, 
              location ? styles.locationText : styles.placeholderText
            ]}>
              {location || 'Select event location'}
            </Text>
            <Ionicons name="location-outline" size={20} color="#666" style={styles.locationIcon} />
          </TouchableOpacity>
        </View>

        {/* Max Attendees */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Max. Attendees</Text>
          <TextInput
            style={styles.textInput}
            value={maxAttendees}
            onChangeText={setMaxAttendees}
            placeholder="Enter max attendees"
            keyboardType="numeric"
          />
        </View>

        {/* Visibility */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Visibility</Text>
          <TouchableOpacity
            style={styles.dropdownInput}
            onPress={() => setShowVisibilityDropdown(!showVisibilityDropdown)}
          >
            <Text style={styles.dropdownText}>{visibility}</Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
          
          {showVisibilityDropdown && (
            <View style={styles.dropdownMenu}>
              {visibilityOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setVisibility(option);
                    setShowVisibilityDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter event description"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Privacy Settings */}
        <View style={styles.inputGroup}>
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Privacy Settings</Text>
            <Switch
              value={privacyEnabled}
              onValueChange={setPrivacyEnabled}
              trackColor={{ false: '#E5E7EB', true: '#10B981' }}
              thumbColor={privacyEnabled ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>
        </View>

        {/* Add Images */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Add Images</Text>
          <View style={styles.imageContainer}>
            {/* Image Preview */}
            <View style={styles.imagePreviewContainer}>
              {selectedImages.map((imageUri, index) => (
                <View key={index} style={styles.imagePreviewWrapper}>
                  <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close-circle" size={20} color="#FF0000" />
                  </TouchableOpacity>
                </View>
              ))}
              
              {/* Add Image Placeholder */}
              {selectedImages.length < 1 && (
                <View style={styles.addImagePlaceholder}>
                  <Ionicons name="image-outline" size={32} color="#999" />
                  <Text style={styles.addImagePlaceholderText}>Add Photos</Text>
                </View>
              )}
            </View>
            
            {/* Gallery and Upload Buttons */}
             {selectedImages.length < 1 && (
            <View style={styles.imageActionButtons}>
              <TouchableOpacity 
                style={styles.imageActionButton}
                onPress={handleGalleryPress}
              >
                <Ionicons name="images-outline" size={20} color="#333" />
                <Text style={styles.imageActionButtonText}>Gallery</Text>
              </TouchableOpacity>
              
              {/* <TouchableOpacity 
                style={styles.imageActionButton}
                onPress={handleUploadPress}
              >
                <Ionicons name="cloud-upload-outline" size={20} color="#333" />
                <Text style={styles.imageActionButtonText}>Upload</Text>
              </TouchableOpacity> */}
            </View>
             )}
            
            {/* Image Guidelines */}
            {/* <Text style={styles.imageGuidelines}>
              Add up to 3 photos to showcase your event (Optional)
            </Text> */}
          </View>
        </View>

        {/* Create Event Button */}
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreateEvent}
        >
          <Text style={styles.createButtonText}>Create Event</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Location Selection Modal */}
      <Modal
        visible={showLocationModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowLocationModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowLocationModal(false)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Location</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Map Container */}
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={mapRegion}
              provider='google'
              onRegionChangeComplete={handleMapRegionChange}
              showsUserLocation={true}
              showsMyLocationButton={true}
            />
            
            {/* Fixed Center Marker */}
            <View style={styles.centerMarker}>
              <Ionicons name="location" size={30} color="#FF0000" />
            </View>

            {/* Location Name Display */}
            {/* {currentLocationName ? (
              <View style={styles.locationNameContainer}>
                <Text style={styles.locationNameText} numberOfLines={2}>
                  {currentLocationName}
                </Text>
              </View>
            ) : null} */}
          </View>

          {/* Confirm Button */}
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={confirmLocation}
            >
              <Text style={styles.confirmButtonText}>Confirm Location</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

       <DateTimePickerModal
        value={selectedDate}
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onConfirm={handleConfirm}
      />
    </SafeAreaView>
  );
};

export default CreateEventScreen;