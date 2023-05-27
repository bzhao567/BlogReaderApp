import React, { useEffect, useState } from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-elements';
import { NativeModules } from 'react-native';


const { UserDefaultsBridge } = NativeModules;

const DetailedView = ({ route }) => {
  const id = route.params ? route.params.id : null;
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    UserDefaultsBridge.fetchBlogs().then((blogs) => {
      const blogArray = blogs.map(blog => JSON.parse(blog));
      const foundBlog = id ? blogArray.find(blog => blog.id === Number(id)) : null;
      setSelectedBlog(foundBlog);
    });
  }, [id]);


  if (!selectedBlog) return null;

  return selectedBlog ?(
    <ScrollView>
      <Card>
        <Card.Title>{selectedBlog.title}</Card.Title>
        <Card.Divider/>
        <Text style={styles.text}>{`Author: ${selectedBlog.author}`}</Text>
        <Text style={styles.text}>{`Date: ${selectedBlog.date}`}</Text>
        <Card.Divider/>
        <Card.Title>About the Author</Card.Title>
        <Text style={styles.text}>{selectedBlog.authorBio}</Text>
        <Card.Divider/>
        <Card.Title>Blog Content</Card.Title>
        <Text style={styles.text}>{selectedBlog.content}</Text>
      </Card>
    </ScrollView>
  ) : null;
}

const styles = StyleSheet.create({
  text: {
    marginBottom: 10,
  },
});

export default DetailedView;