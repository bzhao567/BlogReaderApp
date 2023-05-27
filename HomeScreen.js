import React, { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements';
import blogs from './SampleBlogs.json';
import { NativeModules } from 'react-native';

const { UserDefaultsBridge } = NativeModules;

const HomeScreen = ({ navigation }) => {
  useEffect(() => {
    UserDefaultsBridge.saveBlogs(blogs.map(blog => JSON.stringify(blog)));
  }, []);

  const onSelectBlog = (id) => {
    navigation.navigate('DetailedView', { id: id.toString() });  
  };

  return (
    <ScrollView>
      {
        blogs.map((blog, i) => (
          <ListItem key={i} bottomDivider onPress={() => onSelectBlog(blog.id)}>
            <ListItem.Content>
              <ListItem.Title>{blog.title}</ListItem.Title>
              <ListItem.Subtitle>{`Author: ${blog.author}, Date: ${blog.date}`}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        ))
      }
    </ScrollView>
  );
}

export default HomeScreen;