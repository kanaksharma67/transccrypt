import sys
import os
os.environ["ALBUMENTATIONS_DISABLE_VERSION_CHECK"] = "1"
import cv2
import face_recognition
import numpy as np
import pickle
import albumentations as A
from tqdm import tqdm
from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QLabel, QPushButton, QLineEdit, QVBoxLayout, QHBoxLayout, QWidget, QProgressBar,
    QComboBox, QMessageBox, QFrame
)
from PyQt5.QtCore import Qt, QThread, pyqtSignal
from PyQt5.QtGui import QImage, QPixmap, QColor, QLinearGradient, QBrush, QFont
from PIL import Image, ImageOps
from threading import Thread

# Constants
MODEL_PATH = "models/face_encodings.pkl"
LOCAL_STORAGE_PATH = "local_storage"

if not os.path.exists("models"):
    os.makedirs("models")

if not os.path.exists(LOCAL_STORAGE_PATH):
    os.makedirs(LOCAL_STORAGE_PATH)

def save_image_locally(image, destination_path):
    """Saves an image to the local storage."""
    try:
        if image is None or not isinstance(image, np.ndarray):
            print("Error: Invalid image provided for save.")
            return

        _, img_encoded = cv2.imencode(".jpg", image)
        if img_encoded is None:
            print("Error: Failed to encode image.")
            return

        with open(destination_path, "wb") as f:
            f.write(img_encoded.tobytes())
        print(f"Image saved to {destination_path}.")
    except Exception as e:
        print(f"Error saving image: {e}")

def load_image_locally(image_path):
    """Loads an image from the local storage."""
    try:
        with open(image_path, "rb") as f:
            img_bytes = f.read()
        img_array = np.frombuffer(img_bytes, dtype=np.uint8)
        image = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        return image
    except Exception as e:
        print(f"Error loading image: {e}")
        return None

def adjust_brightness(image, target_brightness=128):
    """Adjust image brightness to a target level."""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    current_brightness = gray.mean()
    ratio = target_brightness / current_brightness
    adjusted_image = cv2.convertScaleAbs(image, alpha=ratio, beta=0)
    return adjusted_image

def align_face(image, face_location):
    """Align face using facial landmarks."""
    top, right, bottom, left = face_location
    face_image = image[top:bottom, left:right]
    landmarks = face_recognition.face_landmarks(face_image)
    if not landmarks:
        return face_image
    landmarks = landmarks[0]
    nose_bridge = landmarks["nose_bridge"]
    dx = nose_bridge[-1][0] - nose_bridge[0][0]
    dy = nose_bridge[-1][1] - nose_bridge[0][1]
    angle = np.degrees(np.arctan2(dy, dx))
    aligned_image = Image.fromarray(face_image)
    aligned_image = ImageOps.exif_transpose(aligned_image.rotate(-angle))
    return np.array(aligned_image)

# Advanced Data Augmentation
augmenter = A.Compose([
    A.HorizontalFlip(p=0.5),
    A.Rotate(limit=20, p=0.5),
    A.GaussianBlur(blur_limit=(0, 1.0), p=0.5),
    A.GaussNoise(var_limit=(10.0, 50.0), p=0.5),
    A.RandomBrightnessContrast(p=0.5),
    A.CLAHE(p=0.5)
])

def augment_image(image):
    augmented = augmenter(image=image)
    return augmented["image"]

class CaptureThread(QThread):
    update_frame = pyqtSignal(QImage)
    update_progress = pyqtSignal(int)
    update_status = pyqtSignal(str)
    capture_complete = pyqtSignal()

    def __init__(self, person_name, person_details, camera_index):
        super().__init__()
        self.person_name = person_name
        self.person_details = person_details
        self.camera_index = camera_index
        self.running = True

    def run(self):
        cap = cv2.VideoCapture(self.camera_index, cv2.CAP_DSHOW)
        if not cap.isOpened():
            self.update_status.emit("Error: Could not open webcam.")
            return

        # Save details locally
        details_path = os.path.join(LOCAL_STORAGE_PATH, self.person_name, "details.txt")
        os.makedirs(os.path.dirname(details_path), exist_ok=True)
        with open(details_path, "w") as f:
            f.write(f"Name: {self.person_name}\nDetails: {self.person_details}")

        count = 0
        total_faces = 100
        face_detection_interval = 5
        frame_count = 0

        while self.running and count < total_faces:
            ret, frame = cap.read()
            if not ret:
                self.update_status.emit("Error: Failed to capture image.")
                break

            frame = adjust_brightness(frame)

            if frame_count % face_detection_interval == 0:
                face_locations = face_recognition.face_locations(frame)
                if face_locations:
                    for top, right, bottom, left in face_locations:
                        aligned_face = align_face(frame, (top, right, bottom, left))
                        image_path = os.path.join(LOCAL_STORAGE_PATH, self.person_name, f"{count + 1}.jpg")
                        os.makedirs(os.path.dirname(image_path), exist_ok=True)
                        Thread(target=save_image_locally, args=(aligned_face, image_path), daemon=True).start()
                        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
                        count += 1
                        self.update_progress.emit(count)
                        self.update_status.emit(f"Faces Captured: {count}/{total_faces} | Status: Face Detected")

            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            h, w, ch = frame.shape
            bytes_per_line = ch * w
            q_img = QImage(frame.data, w, h, bytes_per_line, QImage.Format_RGB888)
            self.update_frame.emit(q_img)

            frame_count += 1
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()
        self.update_status.emit(f"Faces Captured: {count}/{total_faces} | Status: Completed")
        self.capture_complete.emit()

    def stop(self):
        self.running = False

class FaceCaptureApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Face Capture Application")
        self.setGeometry(100, 100, 1200, 800)
        self.setStyleSheet("background-color: #2E3440; color: #ECEFF4;")

        # Central Widget
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        layout = QVBoxLayout(central_widget)

        # Gradient Background
        gradient = QLinearGradient(0, 0, 0, self.height())
        gradient.setColorAt(0, QColor("#6A1B9A"))  # Purple
        gradient.setColorAt(1, QColor("#E91E63"))  # Pink
        central_widget.setAutoFillBackground(True)
        palette = central_widget.palette()
        palette.setBrush(self.backgroundRole(), QBrush(gradient))
        central_widget.setPalette(palette)

        # Title
        title_label = QLabel("Face Capture Application")
        title_label.setStyleSheet("font-size: 32px; font-weight: bold; color: #FFFFFF;")
        title_label.setAlignment(Qt.AlignCenter)
        layout.addWidget(title_label)

        # Input Fields
        input_frame = QFrame()
        input_frame.setStyleSheet("background-color: rgba(255, 255, 255, 0.1); border-radius: 15px; padding: 20px;")
        input_layout = QVBoxLayout(input_frame)

        self.name_entry = QLineEdit()
        self.name_entry.setPlaceholderText("Enter Name")
        self.name_entry.setStyleSheet("font-size: 16px; padding: 12px; border-radius: 10px; background-color: rgba(255, 255, 255, 0.2); color: #FFFFFF;")
        input_layout.addWidget(QLabel("Name:"))
        input_layout.addWidget(self.name_entry)

        self.details_entry = QLineEdit()
        self.details_entry.setPlaceholderText("Enter Details")
        self.details_entry.setStyleSheet("font-size: 16px; padding: 12px; border-radius: 10px; background-color: rgba(255, 255, 255, 0.2); color: #FFFFFF;")
        input_layout.addWidget(QLabel("Details:"))
        input_layout.addWidget(self.details_entry)

        self.camera_combo = QComboBox()
        self.camera_combo.addItems(["0", "1"])
        self.camera_combo.setStyleSheet("font-size: 16px; padding: 12px; border-radius: 10px; background-color: rgba(255, 255, 255, 0.2); color: #FFFFFF;")
        input_layout.addWidget(QLabel("Camera:"))
        input_layout.addWidget(self.camera_combo)

        layout.addWidget(input_frame)

        # Start Capture Button
        self.start_button = QPushButton("Start Capture")
        self.start_button.setStyleSheet("""
            font-size: 18px; font-weight: bold; padding: 15px; border-radius: 10px;
            background-color: #E91E63; color: #FFFFFF;
            border: 2px solid #6A1B9A;
        """)
        self.start_button.clicked.connect(self.start_capture)
        layout.addWidget(self.start_button)

        # Train Model Button
        self.train_button = QPushButton("Train Model")
        self.train_button.setStyleSheet("""
            font-size: 18px; font-weight: bold; padding: 15px; border-radius: 10px;
            background-color: #4CAF50; color: #FFFFFF;
            border: 2px solid #388E3C;
        """)
        self.train_button.clicked.connect(self.train_model)
        layout.addWidget(self.train_button)

        # List Trained Persons Button
        self.list_persons_button = QPushButton("List Trained Persons")
        self.list_persons_button.setStyleSheet("""
            font-size: 18px; font-weight: bold; padding: 15px; border-radius: 10px;
            background-color: #FF9800; color: #FFFFFF;
            border: 2px solid #F57C00;
        """)
        self.list_persons_button.clicked.connect(self.list_trained_persons)
        layout.addWidget(self.list_persons_button)

        # Progress Bar
        self.progress_bar = QProgressBar()
        self.progress_bar.setMaximum(50)
        self.progress_bar.setStyleSheet("""
            font-size: 16px; padding: 10px; border-radius: 10px;
            background-color: rgba(255, 255, 255, 0.2); color: #FFFFFF;
            text-align: center;
        """)
        layout.addWidget(self.progress_bar)

        # Status Label
        self.status_label = QLabel("Faces Captured: 0/50 | Status: Idle")
        self.status_label.setStyleSheet("font-size: 16px; color: #FFFFFF;")
        layout.addWidget(self.status_label)

        # Camera Frame
        self.camera_frame = QLabel()
        self.camera_frame.setStyleSheet("background-color: rgba(255, 255, 255, 0.1); border-radius: 15px;")
        self.camera_frame.setAlignment(Qt.AlignCenter)
        layout.addWidget(self.camera_frame)

    def start_capture(self):
        name = self.name_entry.text().strip()
        details = self.details_entry.text().strip()
        camera_index = int(self.camera_combo.currentText())
        if name and details:
            self.progress_bar.setValue(0)
            self.capture_thread = CaptureThread(name, details, camera_index)
            self.capture_thread.update_frame.connect(self.update_camera_frame)
            self.capture_thread.update_progress.connect(self.progress_bar.setValue)
            self.capture_thread.update_status.connect(self.status_label.setText)
            self.capture_thread.capture_complete.connect(self.capture_complete)
            self.capture_thread.start()
            self.start_button.setEnabled(False)
        else:
            QMessageBox.warning(self, "Input Error", "Please enter both name and details.")

    def update_camera_frame(self, q_img):
        self.camera_frame.setPixmap(QPixmap.fromImage(q_img))

    def capture_complete(self):
        self.start_button.setEnabled(True)
        QMessageBox.information(self, "Success", "Faces captured and saved successfully!")

    def train_model(self):
        known_face_encodings = []
        known_face_names = []

        # List all persons in the local storage
        persons = [d for d in os.listdir(LOCAL_STORAGE_PATH) if os.path.isdir(os.path.join(LOCAL_STORAGE_PATH, d))]
        total_images = sum([len([f for f in os.listdir(os.path.join(LOCAL_STORAGE_PATH, person)) if f.endswith((".jpg", ".png"))]) for person in persons])
        progress_bar = tqdm(total=total_images, desc="Training Model", unit="image")

        for person_name in persons:
            person_dir = os.path.join(LOCAL_STORAGE_PATH, person_name)
            for image_name in os.listdir(person_dir):
                if image_name.endswith((".jpg", ".png")):
                    image_path = os.path.join(person_dir, image_name)
                    image = face_recognition.load_image_file(image_path)
                    augmented_image = augment_image(image)
                    face_encodings = face_recognition.face_encodings(augmented_image, num_jitters=10)

                    for encoding in face_encodings:
                        known_face_encodings.append(encoding)
                        known_face_names.append(person_name)

                    progress_bar.update(1)

        progress_bar.close()

        if not known_face_encodings:
            print("Error: No faces found for training.")
            return

        # Save model locally
        with open(MODEL_PATH, "wb") as f:
            pickle.dump((known_face_encodings, known_face_names), f)

        print(f"Model trained and saved to {MODEL_PATH}!")
        print(f"Total faces encoded: {len(known_face_encodings)}")
        QMessageBox.information(self, "Success", "Model trained and saved successfully!")

    def list_trained_persons(self):
        """List all persons who have trained the model."""
        persons = [d for d in os.listdir(LOCAL_STORAGE_PATH) if os.path.isdir(os.path.join(LOCAL_STORAGE_PATH, d))]
        if not persons:
            QMessageBox.information(self, "Trained Persons", "No persons have been trained yet.")
            return

        details = "Trained Persons:\n\n"
        for person in persons:
            details += f"{person}\n"
            details += load_person_details(person) + "\n\n"

        QMessageBox.information(self, "Trained Persons", details)

    def closeEvent(self, event):
        if hasattr(self, 'capture_thread'):
            self.capture_thread.stop()
        event.accept()

def load_person_details(person_name):
    """Load person details from local storage."""
    try:
        details_path = os.path.join(LOCAL_STORAGE_PATH, person_name, "details.txt")
        if os.path.exists(details_path):
            with open(details_path, "r") as f:
                return f.read()
        return "No details found."
    except Exception as e:
        print(f"Error loading person details: {e}")
        return "Error loading details."

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = FaceCaptureApp()
    window.show()
    sys.exit(app.exec_())
