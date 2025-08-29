import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';

interface PhotoCaptureProps {
  onPhotoTaken: (base64Photo: string) => void;
}

export function PhotoCapture({ onPhotoTaken }: PhotoCaptureProps) {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = useRef<Camera>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg mb-4">We need your permission to show the camera</Text>
        <Button 
          onPress={requestPermission}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Grant Permission
        </Button>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.7,
      });
      onPhotoTaken(photo.base64!);
    }
  };

  return (
    <View className="flex-1">
      <Camera 
        ref={cameraRef}
        type={type}
        className="flex-1"
      >
        <View className="flex-1 bg-transparent">
          <View className="flex-row justify-end p-4">
            <TouchableOpacity
              onPress={() => {
                setType(type === CameraType.back ? CameraType.front : CameraType.back);
              }}
            >
              <Text className="text-white text-lg">Flip</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-1 justify-end items-center mb-8">
            <TouchableOpacity
              onPress={takePicture}
              className="w-20 h-20 bg-white rounded-full"
            >
              <View className="flex-1 m-2 bg-primary rounded-full" />
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </View>
  );
}
