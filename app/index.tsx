import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useEffect, useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  View,
  ScrollView,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Task {
  name: string;
  completed: boolean;
}

export default function Index() {
  const [tasks, setTasks]: [Task[], any] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const savedTasks = await AsyncStorage.getItem("tasks");
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.log("Error loading tasks");
    }
  }

  async function saveTasks(tasks: Task[]) {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
      console.log("Error saving tasks");
    }
  }

  function handleTaskAdd(): void {
    if (newTask.trim()) {
      let updatedTasks = [{ name: newTask, completed: false }, ...tasks];
      setTasks(updatedTasks);
      setNewTask("");
      saveTasks(updatedTasks);
    }
  }

  function handleTaskCompleted(index: number): void {
    let tmp = [...tasks];
    tmp[index].completed = !tmp[index].completed;
    setTasks(tmp);
    saveTasks(tmp);
  }

  function deleteTask(target: number): void {
    let updatedTasks = tasks.filter((_, index) => target != index);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  }

  return (
    <View
      style={{
        padding: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 5,
        }}
      >
        <TextInput
          style={{
            backgroundColor: "white",
            color: "#444",
            borderColor: "gray",
            borderWidth: 1,
            textAlign: "left",
            borderRadius: 10,
            flexGrow: 1,
            paddingHorizontal: 10,
            fontSize: 20,
          }}
          value={newTask}
          onChangeText={setNewTask}
          onSubmitEditing={handleTaskAdd}
          returnKeyType="done"
        />
        <Pressable
          style={{
            justifyContent: "center",
            alignItems: "center",
            borderColor: "gray",
            padding: 10,
            borderRadius: 10,
            borderWidth: 1,
            backgroundColor: "white",
          }}
          onPress={handleTaskAdd}
        >
          <FontAwesome name="plus" size={16} color="gray" />
        </Pressable>
      </View>
      <ScrollView style={{ paddingVertical: 10 }}>
        {tasks.length == 0 && (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text
              style={{
                textAlign: "center",
                opacity: 0.25,
                marginBottom: 25,
                fontSize: 16,
              }}
            >
              No Tasks
            </Text>
            <Image
              source={require("../assets/images/icon.png")}
              style={{ width: 250, height: 250 }}
            />
          </View>
        )}

        {tasks.map((task, index) => (
          <>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                marginBottom: 5,
                opacity: task.completed ? 0.25 : 1,
                padding: 10,
                borderRadius: 10,
              }}
              key={index}
            >
              <Pressable
                onPress={() => handleTaskCompleted(index)}
                style={{
                  width: 24,
                  height: 24,
                  borderWidth: 2,
                  borderColor: "gray",
                  backgroundColor: task.completed ? "gray" : "white",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                }}
              >
                {task.completed && (
                  <FontAwesome name="check" size={18} color="white" />
                )}
              </Pressable>
              <Text
                style={{
                  textDecorationLine: task.completed ? "line-through" : "none",
                  color: "#444",
                  textAlign: "left",
                  fontSize: 20,
                  flexGrow: 1,
                }}
              >
                {task.name}
              </Text>
              <Pressable onPress={() => deleteTask(index)}>
                <Text style={{ color: "red", opacity: 0.5 }}>Delete</Text>
              </Pressable>
            </View>
            <View
              style={{
                borderBottomColor: "gray",
                borderBottomWidth: 1,
              }}
            />
          </>
        ))}
      </ScrollView>
    </View>
  );
}
