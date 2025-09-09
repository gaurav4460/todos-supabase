import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../constants/supabaseClient";

interface Todo {
  id: number;
  task: string;
  is_completed: boolean;
  user_id: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return;

      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.data.user.id)
        .order("id", { ascending: false });

      if (error) throw error;
      setTodos(data || []);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addTodo() {
    try {
      if (!newTask.trim()) return;
      const user = await supabase.auth.getUser();
      if (!user.data.user) return;

      const { data, error } = await supabase
        .from("todos")
        .insert([
          {
            task: newTask.trim(),
            user_id: user.data.user.id,
            is_completed: false,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setTodos([data, ...todos]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  }

  async function toggleTodo(id: number, isCompleted: boolean) {
    try {
      const { error } = await supabase
        .from("todos")
        .update({ is_completed: !isCompleted })
        .eq("id", id);

      if (error) throw error;

      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, is_completed: !isCompleted } : todo
        )
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  }

  async function deleteTodo(id: number) {
    try {
      const { error } = await supabase.from("todos").delete().eq("id", id);

      if (error) throw error;

      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }

  if (loading) {
    return (
      <LinearGradient
        colors={["#007AFF", "#34C759", "#f5f6fa"]}
        style={styles.gradientBg}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#007AFF", "#34C759", "#f5f6fa"]}
      style={styles.gradientBg}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.container}>
        <View style={{ marginTop: 20 }} />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newTask}
            onChangeText={setNewTask}
            placeholder="Add a new task"
            onSubmitEditing={addTodo}
          />
          <TouchableOpacity style={styles.addButton} onPress={addTodo}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={todos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.todoItem}>
              <TouchableOpacity
                style={styles.todoCheckbox}
                onPress={() => toggleTodo(item.id, item.is_completed)}
              >
                {item.is_completed && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
              <Text
                style={[
                  styles.todoText,
                  item.is_completed && styles.completedTodo,
                ]}
              >
                {item.task}
              </Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteTodo(item.id)}
              >
                <Text style={styles.deleteButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },
  container: {
    flex: 1,
    padding: 20,
    width: "100%",
    maxWidth: 500,
    backgroundColor: "transparent",
  },
  loadingContainer: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 48,
    borderColor: "#FFF",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  todoCheckbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#007AFF",
    borderRadius: 12,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  todoText: {
    flex: 1,
    fontSize: 16,
  },
  completedTodo: {
    textDecorationLine: "line-through",
    color: "#FFFF",
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    color: "#FF3B30",
    fontSize: 24,
    fontWeight: "bold",
  },
});
