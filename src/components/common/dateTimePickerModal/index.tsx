import React, { useEffect, useState } from 'react';
import {
  Modal,
  Platform,
  View,
  Button,
  StyleSheet,
  Text,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface DateTimePickerModalProps {
  value: Date;
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
}

const DateTimePickerModal: React.FC<DateTimePickerModalProps> = ({
  value,
  visible,
  onClose,
  onConfirm,
}) => {
  const [mode, setMode] = useState<'date' | 'time'>('date');
  const [tempDate, setTempDate] = useState<Date>(value);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [androidStep, setAndroidStep] = useState<'date' | 'time' | null>(null);

  useEffect(() => {
    if (visible) {
      setTempDate(value);
      if (Platform.OS === 'android') {
        setAndroidStep('date');
        setMode('date');
        setShowPicker(true);
      } else {
        setMode('date');
        setShowPicker(true);
      }
    }
  }, [visible]);

  const handleClose = () => {
    setShowPicker(false);
    setAndroidStep(null);
    onClose();
  };

  const handleChange = (_: any, selectedDate?: Date) => {
    if (selectedDate) {
      const updatedDate = new Date(tempDate);

      if (mode === 'date') {
        updatedDate.setFullYear(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate()
        );
        setTempDate(updatedDate);
        if (Platform.OS === 'android') {
          setShowPicker(false); // Close date picker first
          setTimeout(() => {
            setMode('time');
            setShowPicker(true); // Then open time picker
          }, 200); // slight delay is crucial on Android
        }
      } else {
        updatedDate.setHours(selectedDate.getHours());
        updatedDate.setMinutes(selectedDate.getMinutes());
        updatedDate.setSeconds(0);
        updatedDate.setMilliseconds(0);
        setTempDate(updatedDate);
        onConfirm(updatedDate);
        handleClose();
      }
    } else {
      // User canceled
      handleClose();
    }

    if (Platform.OS === 'ios') return;
    // On Android, always hide picker after selection
    if (mode === 'date') {
      // don't close immediately, since we'll show time next
    } else {
      setShowPicker(false);
    }
  };

  const handleConfirm = () => {
    if (mode === 'date') {
      setMode('time');
    } else {
      onConfirm(tempDate);
      handleClose();
    }
  };

  if (!visible) return null;

  return Platform.OS === 'ios' ? (
    <Modal transparent animationType="slide" visible={showPicker}>
      <View style={styles.container}>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>
            {mode === 'date' ? 'Select Date' : 'Select Time'}
          </Text>

          <DateTimePicker
            value={tempDate}
            mode={mode}
            display="spinner"
            onChange={handleChange}
            style={{ backgroundColor: '#fff' }}
          />

          <View style={styles.buttonRow}>
            <Button title="Cancel" onPress={handleClose} />
            <Button title="Confirm" onPress={handleConfirm} />
          </View>
        </View>
      </View>
    </Modal>
  ) : (
    showPicker && (
      <DateTimePicker
        value={tempDate}
        mode={mode}
        display="default"
        onChange={handleChange}
      />
    )
  );
};

export default DateTimePickerModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#00000088',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  label: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});
