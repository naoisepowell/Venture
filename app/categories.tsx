import { useAuth } from "@/src/auth";
import { AppHeader, EmptyState, ScreenContainer } from "@/src/components";
import { CategoryCard } from "@/src/components/CategoryCard";
import { db } from "@/src/db/client";
import { categories } from "@/src/db/schema";
import { useTheme, spacing } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { eq } from "drizzle-orm";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, View } from "react-native";

// Stores category details to be shown in the list
interface Category {
  id: number;
  name: string;
  colour: string;
  icon: string;
}

export default function CategoriesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { colours } = useTheme();
  const [categoryList, setCategoryList] = useState<Category[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;

      (async () => {
        const rows = await db
          .select({
            id: categories.id,
            name: categories.name,
            colour: categories.colour,
            icon: categories.icon,
          })
          .from(categories)
          .where(eq(categories.userId, user.id))
          .orderBy(categories.name);

        setCategoryList(rows);
      })();
    }, [user])
  );

  // Confirmation box before deleting a category
  const handleDelete = (item: Category) => {
    Alert.alert(
      "Delete Category",
      `Are you sure you want to delete "${item.name}"? Activities using this category will not be deleted but will lose their category link.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await db.delete(categories).where(eq(categories.id, item.id));
            setCategoryList((prev) => prev.filter((c) => c.id !== item.id));
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colours.textPrimary} />
        </Pressable>
        <Pressable
          onPress={() => router.push("/category/form")}
          style={styles.addButton}
        >
          <Ionicons name="add-circle" size={32} color={colours.primary} />
        </Pressable>
      </View>

      <AppHeader
        title="Categories"
        subtitle="Organise your activities by type"
      />

      {categoryList.length === 0 ? (
        <EmptyState
          icon="pricetags-outline"
          title="No categories yet"
          message="Categories will help you organise and filter your travel activities."
        />
      ) : (
        <FlatList
          data={categoryList}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CategoryCard
              name={item.name}
              colour={item.colour}
              icon={item.icon}
              onPress={() => router.push(`/category/form?categoryId=${item.id}`)}
              onLongPress={() => handleDelete(item)}
            />
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
  },
  backButton: {
    paddingVertical: spacing.xs,
  },
  addButton: {
    paddingVertical: spacing.xs,
  },
  list: {
    gap: spacing.sm,
    paddingBottom: spacing["3xl"],
  },
});
