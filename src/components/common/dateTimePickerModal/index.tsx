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

  useEffect(() => {
    if (visible) {
      setMode('date');
      setTempDate(value);
      setShowPicker(true);
    }
  }, [visible]);

  const handleConfirm = () => {
    if (mode === 'date') {
      setMode('time');
    } else {
      // Final confirmation with valid datetime
      onConfirm(tempDate); // Caller can use tempDate.toISOString() in payload
      handleClose();
    }
  };

  const handleClose = () => {
    setShowPicker(false);
    onClose();
  };

  const onChange = (_: any, selectedDate?: Date) => {
    if (selectedDate) {
      const updatedDate = new Date(tempDate);
      if (mode === 'date') {
        updatedDate.setFullYear(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate()
        );
      } else {
        updatedDate.setHours(selectedDate.getHours());
        updatedDate.setMinutes(selectedDate.getMinutes());
        updatedDate.setSeconds(0);
        updatedDate.setMilliseconds(0);
      }
      setTempDate(updatedDate);
    }
  };

  if (!visible) return null;

  return (
    <Modal transparent animationType="slide" visible={showPicker}>
      <View style={styles.container}>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>
            {mode === 'date' ? 'Select Date' : 'Select Time'}
          </Text>

          <DateTimePicker
            value={tempDate}
            mode={mode}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChange}
            style={{ backgroundColor: '#fff' }}
          />

          <View style={styles.buttonRow}>
            <Button title="Cancel" onPress={handleClose} />
            <Button title="Confirm" onPress={handleConfirm} />
          </View>
        </View>
      </View>
    </Modal>
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
