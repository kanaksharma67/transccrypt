import sys
import os
import cv2
import face_recognition
import numpy as np
import pickle
from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QLabel, QPushButton, QVBoxLayout, QWidget, 
    QMessageBox, QDialog, QFileDialog
)
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QColor, QLinearGradient, QBrush

# Constants
MODEL_PATH = "models/face_encodings.pkl"
LOCAL_STORAGE_PATH = "local_storage"

class RecognitionSourceDialog(QDialog):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowTitle("Select Recognition Source")
        self.setGeometry(200, 200, 300, 150)
        self.setStyleSheet("background-color: #2E3440; color: #ECEFF4;")

        layout = QVBoxLayout()

        label = QLabel("Choose the source for face recognition:")
        label.setStyleSheet("font-size: 16px; color: #FFFFFF;")
        layout.addWidget(label)

        self.webcam_button = QPushButton("Webcam")
        self.webcam_button.setStyleSheet("""
            font-size: 14px; padding: 10px; border-radius: 5px;
            background-color: #4CAF50; color: #FFFFFF;
        """)
        self.webcam_button.clicked.connect(self.use_webcam)
        layout.addWidget(self.webcam_button)

        self.phonecam_button = QPushButton("Phone Camera")
        self.phonecam_button.setStyleSheet("""
            font-size: 14px; padding: 10px; border-radius: 5px;
            background-color: #2196F3; color: #FFFFFF;
        """)
        self.phonecam_button.clicked.connect(self.use_phonecam)
        layout.addWidget(self.phonecam_button)

        self.upload_button = QPushButton("Upload Image")
        self.upload_button.setStyleSheet("""
            font-size: 14px; padding: 10px; border-radius: 5px;
            background-color: #E91E63; color: #FFFFFF;
        """)
        self.upload_button.clicked.connect(self.upload_image)
        layout.addWidget(self.upload_button)

        self.setLayout(layout)

    def use_webcam(self):
        self.selected_source = "webcam"
        self.accept()

    def use_phonecam(self):
        self.selected_source = "phonecam"
        self.accept()

    def upload_image(self):
        self.selected_source = "upload"
        self.accept()

class FaceRecognitionApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Face Recognition Application")
        self.setGeometry(100, 100, 800, 600)
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
        title_label = QLabel("Face Recognition Application")
        title_label.setStyleSheet("font-size: 32px; font-weight: bold; color: #FFFFFF;")
        title_label.setAlignment(Qt.AlignCenter)
        layout.addWidget(title_label)

        # Start Recognition Button
        self.recognition_button = QPushButton("Start Recognition")
        self.recognition_button.setStyleSheet("""
            font-size: 18px; font-weight: bold; padding: 15px; border-radius: 10px;
            background-color: #2196F3; color: #FFFFFF;
            border: 2px solid #1976D2;
        """)
        self.recognition_button.clicked.connect(self.start_recognition)
        layout.addWidget(self.recognition_button)

        # List Trained Persons Button
        self.list_persons_button = QPushButton("List Trained Persons")
        self.list_persons_button.setStyleSheet("""
            font-size: 18px; font-weight: bold; padding: 15px; border-radius: 10px;
            background-color: #FF9800; color: #FFFFFF;
            border: 2px solid #F57C00;
        """)
        self.list_persons_button.clicked.connect(self.list_trained_persons)
        layout.addWidget(self.list_persons_button)

    def start_recognition(self):
        dialog = RecognitionSourceDialog(self)
        if dialog.exec_() == QDialog.Accepted:
            if dialog.selected_source == "webcam":
                self.start_webcam_recognition()
            elif dialog.selected_source == "phonecam":
                self.start_phonecam_recognition()
            elif dialog.selected_source == "upload":
                self.start_upload_recognition()

    def start_webcam_recognition(self):
        # Load face encodings
        if not os.path.exists(MODEL_PATH):
            QMessageBox.warning(self, "Error", "Model not found. Please train the model first.")
            return

        with open(MODEL_PATH, "rb") as f:
            known_face_encodings, known_face_names = pickle.load(f)

        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            QMessageBox.showerror(self, "Error", "Could not open webcam.")
            return

        show_popup = False
        recognized_name = None

        while True:
            ret, frame = cap.read()
            if not ret:
                QMessageBox.showerror(self, "Error", "Failed to capture image.")
                break

            small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
            rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

            face_locations = face_recognition.face_locations(rgb_small_frame)
            face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

            recognized_name = None
            for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
                matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
                name = "Unknown"
                confidence = "Unknown"

                if True in matches:
                    first_match_index = matches.index(True)
                    name = known_face_names[first_match_index]
                    face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
                    confidence = f"Confidence: {1 - face_distances[first_match_index]:.2f}"
                    recognized_name = name
                    show_popup = True  # Enable popup when a person is recognized

                top *= 4
                right *= 4
                bottom *= 4
                left *= 4

                cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
                cv2.putText(frame, f"{name} ({confidence})", (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

            # Show popup if a person is recognized
            if show_popup and recognized_name:
                frame = self.show_details_popup(frame, recognized_name)

            cv2.imshow("Face Recognition - Press Q to Quit", frame)

            # Handle key presses
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):  # Quit
                break
            elif key == ord('c'):  # Close popup
                show_popup = False

        cap.release()
        cv2.destroyAllWindows()

    def start_phonecam_recognition(self):
        QMessageBox.information(self, "Info", "Phone camera recognition is not implemented yet.")

    def start_upload_recognition(self):
        file_name, _ = QFileDialog.getOpenFileName(self, "Open Image", "", "Image Files (*.png *.jpg *.jpeg *.bmp)")
        if file_name:
            # Load face encodings
            if not os.path.exists(MODEL_PATH):
                QMessageBox.warning(self, "Error", "Model not found. Please train the model first.")
                return

            with open(MODEL_PATH, "rb") as f:
                known_face_encodings, known_face_names = pickle.load(f)

            image = face_recognition.load_image_file(file_name)
            face_locations = face_recognition.face_locations(image)
            face_encodings = face_recognition.face_encodings(image, face_locations)

            for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
                matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
                name = "Unknown"
                confidence = "Unknown"

                if True in matches:
                    first_match_index = matches.index(True)
                    name = known_face_names[first_match_index]
                    face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
                    confidence = f"Confidence: {1 - face_distances[first_match_index]:.2f}"

                cv2.rectangle(image, (left, top), (right, bottom), (0, 255, 0), 2)
                cv2.putText(image, f"{name} ({confidence})", (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
            cv2.imshow("Uploaded Image Recognition", image)
            cv2.waitKey(0)
            cv2.destroyAllWindows()

    def show_details_popup(self, frame, person_name):
        details = self.load_person_details(person_name)
        # Create a black overlay
        overlay = frame.copy()
        cv2.rectangle(overlay, (0, 0), (frame.shape[1], frame.shape[0]), (0, 0, 0), -1)
        cv2.addWeighted(overlay, 0.7, frame, 0.3, 0, frame)

        # Display the details on the frame
        y = 50
        for line in details.split("\n"):
            cv2.putText(frame, line, (50, y), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
            y += 40

        # Add a close button
        cv2.putText(frame, "Press 'C' to Close", (50, y + 40), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
        return frame

    def load_person_details(self, person_name):
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

    def list_trained_persons(self):
        """List all persons who have trained the model."""
        persons = [d for d in os.listdir(LOCAL_STORAGE_PATH) if os.path.isdir(os.path.join(LOCAL_STORAGE_PATH, d))]
        if not persons:
            QMessageBox.information(self, "Trained Persons", "No persons have been trained yet.")
            return

        details = "Trained Persons:\n\n"
        for person in persons:
            details += f"{person}\n"
            details += self.load_person_details(person) + "\n\n"

        QMessageBox.information(self, "Trained Persons", details)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = FaceRecognitionApp()
    window.show()
    sys.exit(app.exec_())
