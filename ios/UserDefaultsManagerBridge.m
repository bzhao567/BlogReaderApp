#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import "BlogReaderApp-Swift.h"

@interface UserDefaultsBridge: NSObject <RCTBridgeModule>
@end

@implementation UserDefaultsBridge

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(saveBlogs:(NSArray *)blogs)
{
  UserDefaultsManager *manager = [[UserDefaultsManager alloc] init];
  [manager saveBlogs:blogs];
}

RCT_REMAP_METHOD(fetchBlogs,  
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  UserDefaultsManager *manager = [[UserDefaultsManager alloc] init];
  NSArray *blogs = [manager fetchBlogs];
  if (blogs) {
    resolve(blogs);
  } else {
    NSError *error = [NSError errorWithDomain:@"com.blogreaderapp"
                                         code:200
                                     userInfo:@{@"Error reason": @"Could not fetch blogs"}];
    reject(@"no_blogs", @"There were no blogs", error);
  }
}

@end
